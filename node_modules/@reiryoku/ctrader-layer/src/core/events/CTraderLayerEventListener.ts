import { CTraderLayerEvent } from "#events/CTraderLayerEvent";

export type CTraderLayerEventListener = ((event: CTraderLayerEvent) => any) | (() => any);
