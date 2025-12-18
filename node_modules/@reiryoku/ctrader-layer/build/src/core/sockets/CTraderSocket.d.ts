/// <reference types="node" />
import { CTraderSocketParameters } from "./CTraderSocketParameters";
export declare class CTraderSocket {
    #private;
    constructor({ host, port, }: CTraderSocketParameters);
    get host(): string;
    get port(): number;
    connect(): void;
    disconnect(): void;
    send(buffer: Buffer): void;
    onOpen(): void;
    onData(...parameters: any[]): void;
    onClose(): void;
    onError(): void;
}
