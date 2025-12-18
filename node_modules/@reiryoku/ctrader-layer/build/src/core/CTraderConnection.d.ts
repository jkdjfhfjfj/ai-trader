import { GenericObject } from "./utilities/GenericObject";
import { CTraderConnectionParameters } from "./CTraderConnectionParameters";
import { CTraderLayerEventListener } from "./events/CTraderLayerEventListener";
import { CTraderLayerEvent } from "./events/CTraderLayerEvent";
export declare class CTraderConnection {
    #private;
    constructor({ host, port, }: CTraderConnectionParameters);
    getPayloadTypeByName(name: string): number;
    getPayloadNameByType(type: number): string;
    sendCommand(payloadName: string, data?: GenericObject, messageId?: string): Promise<GenericObject>;
    trySendCommand(payloadName: string, data?: GenericObject, messageId?: string): Promise<GenericObject | undefined>;
    sendHeartbeat(): void;
    open(): Promise<unknown>;
    close(): void;
    on(payloadName: string): Promise<CTraderLayerEvent>;
    on(payloadName: string, listener: CTraderLayerEventListener): string;
    removeEventListener(uuid: string): void;
    static getAccessTokenProfile(accessToken: string): Promise<GenericObject>;
    static getAccessTokenAccounts(accessToken: string): Promise<GenericObject[]>;
}
