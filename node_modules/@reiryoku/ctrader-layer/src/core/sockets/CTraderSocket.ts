import * as tls from "tls";
import { CTraderSocketParameters } from "#sockets/CTraderSocketParameters";
import { CTraderLayerUtilities } from "#utilities/CTraderLayerUtilities";

const isBrowser: boolean = CTraderLayerUtilities.isBrowser();

export class CTraderSocket {
    readonly #host: string;
    readonly #port: number;
    #tlsSocket?: tls.TLSSocket;
    #webSocket?: WebSocket;

    public constructor ({ host, port, }: CTraderSocketParameters) {
        this.#host = host;
        this.#port = port;
        this.#tlsSocket = undefined;
        this.#webSocket = undefined;
    }

    public get host (): string {
        return this.#host;
    }

    public get port (): number {
        return this.#port;
    }

    public connect (): void {
        if (isBrowser) {
            const socket = new WebSocket(`wss://${this.#host}:${this.#port}`);
            socket.binaryType = "arraybuffer";

            socket.addEventListener("open", this.onOpen);
            socket.addEventListener("message", this.onData);
            socket.addEventListener("close", this.onClose);
            socket.addEventListener("error", this.onError);

            this.#webSocket = socket;
        }
        else {
            // @ts-ignore
            const socket = tls.connect(this.#port, this.#host, this.onOpen);

            socket.on("data", this.onData);
            socket.on("end", this.onClose);
            socket.on("error", this.onError);

            this.#tlsSocket = socket;
        }
    }

    public disconnect (): void {
        this.#tlsSocket?.destroy();
        this.#webSocket?.close();
    }

    public send (buffer: Buffer): void {
        this.#tlsSocket?.write(buffer);
        this.#webSocket?.send(buffer);
    }

    public onOpen (): void {
        // Silence is golden
    }

    public onData (...parameters: any[]): void {
        // Silence is golden
    }

    public onClose (): void {
        // Silence is golden
    }

    public onError (): void {
        // Silence is golden
    }
}
