import { CTraderCommandParameters } from "./CTraderCommandParameters";
import { GenericObject } from "../utilities/GenericObject";
export declare class CTraderCommand {
    #private;
    constructor({ clientMsgId, }: CTraderCommandParameters);
    get clientMsgId(): string;
    get responsePromise(): Promise<GenericObject>;
    get response(): GenericObject | undefined;
    resolve(response: GenericObject): void;
    reject(response: GenericObject): void;
}
