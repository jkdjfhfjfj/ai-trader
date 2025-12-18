import { CTraderLayerEventParameters } from "./CTraderLayerEventParameters";
import { GenericObject } from "../utilities/GenericObject";
export declare class CTraderLayerEvent {
    #private;
    constructor({ type, date, descriptor, }: CTraderLayerEventParameters);
    get type(): string;
    get date(): Date;
    get descriptor(): GenericObject;
}
