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
var _CTraderLayerEvent_type, _CTraderLayerEvent_date, _CTraderLayerEvent_descriptor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderLayerEvent = void 0;
class CTraderLayerEvent {
    constructor({ type, date, descriptor = {}, }) {
        _CTraderLayerEvent_type.set(this, void 0);
        _CTraderLayerEvent_date.set(this, void 0);
        _CTraderLayerEvent_descriptor.set(this, void 0);
        __classPrivateFieldSet(this, _CTraderLayerEvent_type, type, "f");
        __classPrivateFieldSet(this, _CTraderLayerEvent_date, new Date(date), "f");
        __classPrivateFieldSet(this, _CTraderLayerEvent_descriptor, Object.assign({}, descriptor), "f");
    }
    get type() {
        return __classPrivateFieldGet(this, _CTraderLayerEvent_type, "f");
    }
    get date() {
        return new Date(__classPrivateFieldGet(this, _CTraderLayerEvent_date, "f"));
    }
    get descriptor() {
        return Object.assign({}, __classPrivateFieldGet(this, _CTraderLayerEvent_descriptor, "f"));
    }
}
exports.CTraderLayerEvent = CTraderLayerEvent;
_CTraderLayerEvent_type = new WeakMap(), _CTraderLayerEvent_date = new WeakMap(), _CTraderLayerEvent_descriptor = new WeakMap();
//# sourceMappingURL=CTraderLayerEvent.js.map