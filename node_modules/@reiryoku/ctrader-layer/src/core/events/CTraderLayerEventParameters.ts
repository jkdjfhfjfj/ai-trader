import { CTraderLayerEvent } from "#events/CTraderLayerEvent";
import { GenericObject } from "#utilities/GenericObject";

/**
 * The event constructor parameters
 * @see CTraderLayerEvent
 */
export type CTraderLayerEventParameters = {
    type: string;
    date: Date;
    descriptor?: GenericObject;
};
