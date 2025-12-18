import { CTraderCommand } from "./CTraderCommand";
import { CTraderCommandMapParameters } from "./CTraderCommandMapParameters";
import { GenericObject } from "../utilities/GenericObject";
export declare class CTraderCommandMap {
    #private;
    constructor({ send, }: CTraderCommandMapParameters);
    get openCommands(): CTraderCommand[];
    create({ clientMsgId, message, }: {
        clientMsgId: string;
        message: GenericObject;
    }): Promise<GenericObject>;
    extractById(clientMsgId: string): CTraderCommand | undefined;
}
