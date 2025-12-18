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
var _CTraderCommand_clientMsgId, _CTraderCommand_responsePromise, _CTraderCommand_response, _CTraderCommand_resolve, _CTraderCommand_reject;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderCommand = void 0;
class CTraderCommand {
    constructor({ clientMsgId, }) {
        _CTraderCommand_clientMsgId.set(this, void 0);
        _CTraderCommand_responsePromise.set(this, void 0);
        _CTraderCommand_response.set(this, void 0);
        _CTraderCommand_resolve.set(this, void 0);
        _CTraderCommand_reject.set(this, void 0);
        __classPrivateFieldSet(this, _CTraderCommand_clientMsgId, clientMsgId, "f");
        __classPrivateFieldSet(this, _CTraderCommand_responsePromise, new Promise((resolve, reject) => {
            __classPrivateFieldSet(this, _CTraderCommand_resolve, resolve, "f");
            __classPrivateFieldSet(this, _CTraderCommand_reject, reject, "f");
        }), "f");
        __classPrivateFieldSet(this, _CTraderCommand_response, undefined, "f");
    }
    get clientMsgId() {
        return __classPrivateFieldGet(this, _CTraderCommand_clientMsgId, "f");
    }
    get responsePromise() {
        return __classPrivateFieldGet(this, _CTraderCommand_responsePromise, "f");
    }
    get response() {
        return __classPrivateFieldGet(this, _CTraderCommand_response, "f");
    }
    resolve(response) {
        var _a;
        __classPrivateFieldSet(this, _CTraderCommand_response, response, "f");
        (_a = __classPrivateFieldGet(this, _CTraderCommand_resolve, "f")) === null || _a === void 0 ? void 0 : _a.call(this, response);
    }
    reject(response) {
        var _a;
        __classPrivateFieldSet(this, _CTraderCommand_response, response, "f");
        (_a = __classPrivateFieldGet(this, _CTraderCommand_reject, "f")) === null || _a === void 0 ? void 0 : _a.call(this, response);
    }
}
exports.CTraderCommand = CTraderCommand;
_CTraderCommand_clientMsgId = new WeakMap(), _CTraderCommand_responsePromise = new WeakMap(), _CTraderCommand_response = new WeakMap(), _CTraderCommand_resolve = new WeakMap(), _CTraderCommand_reject = new WeakMap();
//# sourceMappingURL=CTraderCommand.js.map