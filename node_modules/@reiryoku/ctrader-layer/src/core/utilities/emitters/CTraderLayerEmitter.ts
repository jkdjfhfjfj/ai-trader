import { CTraderLayerEvent } from "#events/CTraderLayerEvent";
import { CTraderLayerEventListener } from "#events/CTraderLayerEventListener";
import { GenericObject } from "#utilities/GenericObject";
import { v1 } from "uuid";

export class CTraderLayerEmitter {
    static readonly #ANY_TYPE_KEY: string = "*";
    readonly #listeners: Map<string, Map<string, CTraderLayerEventListener>>;

    public constructor () {
        this.#listeners = new Map();
    }

    public addEventListener (type: string, listener: CTraderLayerEventListener): string {
        let uuid: string;

        do {
            uuid = v1();
        }
        while (this.#uuidExists(uuid)); // This software deals with money, better to avoid even the most improbable events

        const listenersOfType: Map<string, CTraderLayerEventListener> = this.#listeners.get(type) ?? new Map();

        listenersOfType.set(uuid, listener);
        this.#listeners.set(type, listenersOfType);

        return uuid;
    }

    public removeEventListener (uuid: string): void {
        for (const type of this.#listeners.keys()) {
            const listenersOfType: Map<string, CTraderLayerEventListener> | undefined = this.#listeners.get(type);

            if (listenersOfType?.has(uuid)) {
                listenersOfType.delete(uuid);

                break;
            }
        }
    }

    public on (type: string): Promise<CTraderLayerEvent>
    public on (type: string, listener: CTraderLayerEventListener): string
    public on (type: string, listener?: CTraderLayerEventListener): Promise<CTraderLayerEvent> | string {
        if (!listener) {
            return new Promise((resolve: any): void => {
                const uuid: string = this.addEventListener(type, async (event: CTraderLayerEvent): Promise<void> => {
                    this.removeEventListener(uuid);
                    resolve(event);
                });
            });
        }

        return this.addEventListener(type, listener);
    }

    public notifyListeners (type: string, descriptor?: GenericObject): void {
        const date: Date = new Date();
        const event: CTraderLayerEvent = new CTraderLayerEvent({
            type,
            date,
            descriptor,
        });

        if (type !== CTraderLayerEmitter.#ANY_TYPE_KEY) {
            const listenersOfAny: Map<string, CTraderLayerEventListener> = this.#listeners.get(CTraderLayerEmitter.#ANY_TYPE_KEY) ?? new Map();

            for (const listener of listenersOfAny.values()) {
                listener(event);
            }
        }

        const listenersOfType: Map<string, CTraderLayerEventListener> = this.#listeners.get(type) ?? new Map();

        for (const listener of listenersOfType.values()) {
            listener(event);
        }
    }

    #uuidExists (uuid: string): boolean {
        for (const key of this.#listeners.keys()) {
            const listeners: Map<string, CTraderLayerEventListener> | undefined = this.#listeners.get(key);

            if (listeners?.has(uuid)) {
                return true;
            }
        }

        return false;
    }
}
