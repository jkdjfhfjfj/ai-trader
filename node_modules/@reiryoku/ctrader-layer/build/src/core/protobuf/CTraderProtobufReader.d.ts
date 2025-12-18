import { GenericObject } from "../utilities/GenericObject";
export declare class CTraderProtobufReader {
    #private;
    constructor(options: GenericObject);
    encode(payloadType: number, params: GenericObject, clientMsgId: string): any;
    decode(buffer: GenericObject): any;
    load(): void;
    build(): any;
    findPayloadType(message: GenericObject): any;
    getMessageByPayloadType(payloadType: number): any;
    getMessageByName(name: string): any;
    getPayloadTypeByName(name: string): number;
    getPayloadNameByType(type: number): string;
}
