/// <reference types="node" />
import { GenericObject } from "../utilities/GenericObject";
export declare class CTraderEncoderDecoder {
    #private;
    constructor();
    setDecodeHandler(handler: (...parameters: any[]) => any): void;
    encode(data: GenericObject): Buffer;
    decode(buffer: Buffer): void;
}
