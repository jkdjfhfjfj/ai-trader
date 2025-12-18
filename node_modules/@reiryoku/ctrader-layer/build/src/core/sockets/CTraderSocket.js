"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CTraderSocket_host, _CTraderSocket_port, _CTraderSocket_tlsSocket, _CTraderSocket_webSocket;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderSocket = void 0;
const tls = require("tls");
const CTraderLayerUtilities_1 = require("../utilities/CTraderLayerUtilities");
const isBrowser = CTraderLayerUtilities_1.CTraderLayerUtilities.isBrowser();
class CTraderSocket {
    constructor({ host, port, }) {
        _CTraderSocket_host.set(this, void 0);
        _CTraderSocket_port.set(this, void 0);
        _CTraderSocket_tlsSocket.set(this, void 0);
        _CTraderSocket_webSocket.set(this, void 0);
        __classPrivateFieldSet(this, _CTraderSocket_host, host, "f");
        __classPrivateFieldSet(this, _CTraderSocket_port, port, "f");
        __classPrivateFieldSet(this, _CTraderSocket_tlsSocket, undefined, "f");
        __classPrivateFieldSet(this, _CTraderSocket_webSocket, undefined, "f");
    }
    get host() {
        return __classPrivateFieldGet(this, _CTraderSocket_host, "f");
    }
    get port() {
        return __classPrivateFieldGet(this, _CTraderSocket_port, "f");
    }
    connect() {
        if (isBrowser) {
            const socket = new WebSocket(`wss://${__classPrivateFieldGet(this, _CTraderSocket_host, "f")}:${__classPrivateFieldGet(this, _CTraderSocket_port, "f")}`);
            socket.binaryType = "arraybuffer";
            socket.addEventListener("open", this.onOpen);
            socket.addEventListener("message", this.onData);
            socket.addEventListener("close", this.onClose);
            socket.addEventListener("error", this.onError);
            __classPrivateFieldSet(this, _CTraderSocket_webSocket, socket, "f");
        }
        else {
            const socket = tls.connect(__classPrivateFieldGet(this, _CTraderSocket_port, "f"), __classPrivateFieldGet(this, _CTraderSocket_host, "f"), this.onOpen);
            socket.on("data", this.onData);
            socket.on("end", this.onClose);
            socket.on("error", this.onError);
            __classPrivateFieldSet(this, _CTraderSocket_tlsSocket, socket, "f");
        }
    }
    disconnect() {
        var _a, _b;
        (_a = __classPrivateFieldGet(this, _CTraderSocket_tlsSocket, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = __classPrivateFieldGet(this, _CTraderSocket_webSocket, "f")) === null || _b === void 0 ? void 0 : _b.close();
    }
    send(buffer) {
        var _a, _b;
        (_a = __classPrivateFieldGet(this, _CTraderSocket_tlsSocket, "f")) === null || _a === void 0 ? void 0 : _a.write(buffer);
        (_b = __classPrivateFieldGet(this, _CTraderSocket_webSocket, "f")) === null || _b === void 0 ? void 0 : _b.send(buffer);
    }
    onOpen() {
    }
    onData(...parameters) {
    }
    onClose() {
    }
    onError() {
    }
}
exports.CTraderSocket = CTraderSocket;
_CTraderSocket_host = new WeakMap(), _CTraderSocket_port = new WeakMap(), _CTraderSocket_tlsSocket = new WeakMap(), _CTraderSocket_webSocket = new WeakMap();
//# sourceMappingURL=CTraderSocket.js.map