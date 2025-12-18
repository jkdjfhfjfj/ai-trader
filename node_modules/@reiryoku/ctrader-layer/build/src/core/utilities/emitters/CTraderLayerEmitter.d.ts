import { CTraderLayerEvent } from "../../events/CTraderLayerEvent";
import { CTraderLayerEventListener } from "../../events/CTraderLayerEventListener";
import { GenericObject } from "../GenericObject";
export declare class CTraderLayerEmitter {
    #private;
    constructor();
    addEventListener(type: string, listener: CTraderLayerEventListener): string;
    removeEventListener(uuid: string): void;
    on(type: string): Promise<CTraderLayerEvent>;
    on(type: string, listener: CTraderLayerEventListener): string;
    notifyListeners(type: string, descriptor?: GenericObject): void;
}
