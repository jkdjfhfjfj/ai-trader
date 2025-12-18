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
var _CTraderEncoderDecoder_sizeLength, _CTraderEncoderDecoder_size, _CTraderEncoderDecoder_tail, _CTraderEncoderDecoder_decodeHandler;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderEncoderDecoder = void 0;
const buffer_1 = require("buffer");
const CTraderLayerUtilities_1 = require("../utilities/CTraderLayerUtilities");
const isBrowser = CTraderLayerUtilities_1.CTraderLayerUtilities.isBrowser();
class CTraderEncoderDecoder {
    constructor() {
        _CTraderEncoderDecoder_sizeLength.set(this, void 0);
        _CTraderEncoderDecoder_size.set(this, void 0);
        _CTraderEncoderDecoder_tail.set(this, void 0);
        _CTraderEncoderDecoder_decodeHandler.set(this, void 0);
        __classPrivateFieldSet(this, _CTraderEncoderDecoder_sizeLength, 4, "f");
        __classPrivateFieldSet(this, _CTraderEncoderDecoder_size, undefined, "f");
        __classPrivateFieldSet(this, _CTraderEncoderDecoder_tail, undefined, "f");
        __classPrivateFieldSet(this, _CTraderEncoderDecoder_decodeHandler, undefined, "f");
    }
    setDecodeHandler(handler) {
        __classPrivateFieldSet(this, _CTraderEncoderDecoder_decodeHandler, handler, "f");
    }
    encode(data) {
        const normalizedData = data.toBuffer();
        if (isBrowser) {
            return normalizedData;
        }
        const sizeLength = __classPrivateFieldGet(this, _CTraderEncoderDecoder_sizeLength, "f");
        const normalizedDataLength = normalizedData.length;
        const size = buffer_1.Buffer.alloc(sizeLength);
        size.writeInt32BE(normalizedDataLength, 0);
        return buffer_1.Buffer.concat([size, normalizedData,], sizeLength + normalizedDataLength);
    }
    decode(buffer) {
        if (isBrowser) {
            if (__classPrivateFieldGet(this, _CTraderEncoderDecoder_decodeHandler, "f")) {
                __classPrivateFieldGet(this, _CTraderEncoderDecoder_decodeHandler, "f").call(this, buffer.data);
            }
            return;
        }
        const size = __classPrivateFieldGet(this, _CTraderEncoderDecoder_size, "f");
        let usedBuffer = buffer;
        if (__classPrivateFieldGet(this, _CTraderEncoderDecoder_tail, "f")) {
            usedBuffer = buffer_1.Buffer.concat([__classPrivateFieldGet(this, _CTraderEncoderDecoder_tail, "f"), usedBuffer,], __classPrivateFieldGet(this, _CTraderEncoderDecoder_tail, "f").length + usedBuffer.length);
            __classPrivateFieldSet(this, _CTraderEncoderDecoder_tail, undefined, "f");
        }
        if (size) {
            if (usedBuffer.length >= size) {
                if (__classPrivateFieldGet(this, _CTraderEncoderDecoder_decodeHandler, "f")) {
                    __classPrivateFieldGet(this, _CTraderEncoderDecoder_decodeHandler, "f").call(this, usedBuffer.slice(0, size));
                }
                __classPrivateFieldSet(this, _CTraderEncoderDecoder_size, undefined, "f");
                if (usedBuffer.length !== size) {
                    this.decode(usedBuffer.slice(size));
                }
                return;
            }
        }
        else {
            if (usedBuffer.length >= __classPrivateFieldGet(this, _CTraderEncoderDecoder_sizeLength, "f")) {
                __classPrivateFieldSet(this, _CTraderEncoderDecoder_size, usedBuffer.readUInt32BE(0), "f");
                if (usedBuffer.length !== __classPrivateFieldGet(this, _CTraderEncoderDecoder_sizeLength, "f")) {
                    this.decode(usedBuffer.slice(__classPrivateFieldGet(this, _CTraderEncoderDecoder_sizeLength, "f")));
                }
                return;
            }
        }
        __classPrivateFieldSet(this, _CTraderEncoderDecoder_tail, usedBuffer, "f");
    }
}
exports.CTraderEncoderDecoder = CTraderEncoderDecoder;
_CTraderEncoderDecoder_sizeLength = new WeakMap(), _CTraderEncoderDecoder_size = new WeakMap(), _CTraderEncoderDecoder_tail = new WeakMap(), _CTraderEncoderDecoder_decodeHandler = new WeakMap();
//# sourceMappingURL=CTraderEncoderDecoder.js.map