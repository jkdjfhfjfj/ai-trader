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
var _CTraderCommandMap_openCommands, _CTraderCommandMap_send;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderCommandMap = void 0;
const CTraderCommand_1 = require("./CTraderCommand");
class CTraderCommandMap {
    constructor({ send, }) {
        _CTraderCommandMap_openCommands.set(this, void 0);
        _CTraderCommandMap_send.set(this, void 0);
        __classPrivateFieldSet(this, _CTraderCommandMap_openCommands, new Map(), "f");
        __classPrivateFieldSet(this, _CTraderCommandMap_send, send, "f");
    }
    get openCommands() {
        return [...__classPrivateFieldGet(this, _CTraderCommandMap_openCommands, "f").values(),];
    }
    create({ clientMsgId, message, }) {
        const command = new CTraderCommand_1.CTraderCommand({ clientMsgId, });
        __classPrivateFieldGet(this, _CTraderCommandMap_openCommands, "f").set(clientMsgId, command);
        __classPrivateFieldGet(this, _CTraderCommandMap_send, "f").call(this, message);
        return command.responsePromise;
    }
    extractById(clientMsgId) {
        const command = __classPrivateFieldGet(this, _CTraderCommandMap_openCommands, "f").get(clientMsgId);
        if (!command) {
            return undefined;
        }
        __classPrivateFieldGet(this, _CTraderCommandMap_openCommands, "f").delete(clientMsgId);
        return command;
    }
}
exports.CTraderCommandMap = CTraderCommandMap;
_CTraderCommandMap_openCommands = new WeakMap(), _CTraderCommandMap_send = new WeakMap();
//# sourceMappingURL=CTraderCommandMap.js.map