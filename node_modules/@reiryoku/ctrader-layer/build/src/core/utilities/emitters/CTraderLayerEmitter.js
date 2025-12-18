"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _CTraderLayerEmitter_instances, _a, _CTraderLayerEmitter_ANY_TYPE_KEY, _CTraderLayerEmitter_listeners, _CTraderLayerEmitter_uuidExists;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderLayerEmitter = void 0;
const CTraderLayerEvent_1 = require("../../events/CTraderLayerEvent");
const uuid_1 = require("uuid");
class CTraderLayerEmitter {
    constructor() {
        _CTraderLayerEmitter_instances.add(this);
        _CTraderLayerEmitter_listeners.set(this, void 0);
        __classPrivateFieldSet(this, _CTraderLayerEmitter_listeners, new Map(), "f");
    }
    addEventListener(type, listener) {
        var _b;
        let uuid;
        do {
            uuid = uuid_1.v1();
        } while (__classPrivateFieldGet(this, _CTraderLayerEmitter_instances, "m", _CTraderLayerEmitter_uuidExists).call(this, uuid));
        const listenersOfType = (_b = __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").get(type)) !== null && _b !== void 0 ? _b : new Map();
        listenersOfType.set(uuid, listener);
        __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").set(type, listenersOfType);
        return uuid;
    }
    removeEventListener(uuid) {
        for (const type of __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").keys()) {
            const listenersOfType = __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").get(type);
            if (listenersOfType === null || listenersOfType === void 0 ? void 0 : listenersOfType.has(uuid)) {
                listenersOfType.delete(uuid);
                break;
            }
        }
    }
    on(type, listener) {
        if (!listener) {
            return new Promise((resolve) => {
                const uuid = this.addEventListener(type, (event) => __awaiter(this, void 0, void 0, function* () {
                    this.removeEventListener(uuid);
                    resolve(event);
                }));
            });
        }
        return this.addEventListener(type, listener);
    }
    notifyListeners(type, descriptor) {
        var _b, _c;
        const date = new Date();
        const event = new CTraderLayerEvent_1.CTraderLayerEvent({
            type,
            date,
            descriptor,
        });
        if (type !== __classPrivateFieldGet(CTraderLayerEmitter, _a, "f", _CTraderLayerEmitter_ANY_TYPE_KEY)) {
            const listenersOfAny = (_b = __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").get(__classPrivateFieldGet(CTraderLayerEmitter, _a, "f", _CTraderLayerEmitter_ANY_TYPE_KEY))) !== null && _b !== void 0 ? _b : new Map();
            for (const listener of listenersOfAny.values()) {
                listener(event);
            }
        }
        const listenersOfType = (_c = __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").get(type)) !== null && _c !== void 0 ? _c : new Map();
        for (const listener of listenersOfType.values()) {
            listener(event);
        }
    }
}
exports.CTraderLayerEmitter = CTraderLayerEmitter;
_a = CTraderLayerEmitter, _CTraderLayerEmitter_listeners = new WeakMap(), _CTraderLayerEmitter_instances = new WeakSet(), _CTraderLayerEmitter_uuidExists = function _CTraderLayerEmitter_uuidExists(uuid) {
    for (const key of __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").keys()) {
        const listeners = __classPrivateFieldGet(this, _CTraderLayerEmitter_listeners, "f").get(key);
        if (listeners === null || listeners === void 0 ? void 0 : listeners.has(uuid)) {
            return true;
        }
    }
    return false;
};
_CTraderLayerEmitter_ANY_TYPE_KEY = { value: "*" };
//# sourceMappingURL=CTraderLayerEmitter.js.map