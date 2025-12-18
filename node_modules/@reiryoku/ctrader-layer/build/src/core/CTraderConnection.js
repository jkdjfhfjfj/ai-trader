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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CTraderConnection_instances, _CTraderConnection_commandMap, _CTraderConnection_encoderDecoder, _CTraderConnection_protobufReader, _CTraderConnection_socket, _CTraderConnection_emitter, _CTraderConnection_resolveConnectionPromise, _CTraderConnection_rejectConnectionPromise, _CTraderConnection_send, _CTraderConnection_onOpen, _CTraderConnection_onData, _CTraderConnection_onDecodedData, _CTraderConnection_onClose, _CTraderConnection_onPushEvent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderConnection = void 0;
const path = require("path");
const uuid_1 = require("uuid");
const axios_1 = require("axios");
const CTraderCommandMap_1 = require("./commands/CTraderCommandMap");
const CTraderEncoderDecoder_1 = require("./encoder-decoder/CTraderEncoderDecoder");
const CTraderSocket_1 = require("./sockets/CTraderSocket");
const CTraderProtobufReader_1 = require("./protobuf/CTraderProtobufReader");
const CTraderLayerEmitter_1 = require("./utilities/emitters/CTraderLayerEmitter");
class CTraderConnection {
    constructor({ host, port, }) {
        _CTraderConnection_instances.add(this);
        _CTraderConnection_commandMap.set(this, void 0);
        _CTraderConnection_encoderDecoder.set(this, void 0);
        _CTraderConnection_protobufReader.set(this, void 0);
        _CTraderConnection_socket.set(this, void 0);
        _CTraderConnection_emitter.set(this, void 0);
        _CTraderConnection_resolveConnectionPromise.set(this, void 0);
        _CTraderConnection_rejectConnectionPromise.set(this, void 0);
        __classPrivateFieldSet(this, _CTraderConnection_commandMap, new CTraderCommandMap_1.CTraderCommandMap({ send: (data) => __classPrivateFieldGet(this, _CTraderConnection_instances, "m", _CTraderConnection_send).call(this, data), }), "f");
        __classPrivateFieldSet(this, _CTraderConnection_encoderDecoder, new CTraderEncoderDecoder_1.CTraderEncoderDecoder(), "f");
        __classPrivateFieldSet(this, _CTraderConnection_protobufReader, new CTraderProtobufReader_1.CTraderProtobufReader([{
                file: path.resolve(__dirname, "../../../protobuf/OpenApiCommonMessages.proto"),
            }, {
                file: path.resolve(__dirname, "../../../protobuf/OpenApiMessages.proto"),
            },]), "f");
        __classPrivateFieldSet(this, _CTraderConnection_socket, new CTraderSocket_1.CTraderSocket({ host, port, }), "f");
        __classPrivateFieldSet(this, _CTraderConnection_emitter, new CTraderLayerEmitter_1.CTraderLayerEmitter(), "f");
        __classPrivateFieldSet(this, _CTraderConnection_resolveConnectionPromise, undefined, "f");
        __classPrivateFieldSet(this, _CTraderConnection_rejectConnectionPromise, undefined, "f");
        __classPrivateFieldGet(this, _CTraderConnection_encoderDecoder, "f").setDecodeHandler((data) => __classPrivateFieldGet(this, _CTraderConnection_instances, "m", _CTraderConnection_onDecodedData).call(this, __classPrivateFieldGet(this, _CTraderConnection_protobufReader, "f").decode(data)));
        __classPrivateFieldGet(this, _CTraderConnection_protobufReader, "f").load();
        __classPrivateFieldGet(this, _CTraderConnection_protobufReader, "f").build();
        __classPrivateFieldGet(this, _CTraderConnection_socket, "f").onOpen = () => __classPrivateFieldGet(this, _CTraderConnection_instances, "m", _CTraderConnection_onOpen).call(this);
        __classPrivateFieldGet(this, _CTraderConnection_socket, "f").onData = (data) => __classPrivateFieldGet(this, _CTraderConnection_instances, "m", _CTraderConnection_onData).call(this, data);
        __classPrivateFieldGet(this, _CTraderConnection_socket, "f").onClose = () => __classPrivateFieldGet(this, _CTraderConnection_instances, "m", _CTraderConnection_onClose).call(this);
    }
    getPayloadTypeByName(name) {
        return __classPrivateFieldGet(this, _CTraderConnection_protobufReader, "f").getPayloadTypeByName(name);
    }
    getPayloadNameByType(type) {
        return __classPrivateFieldGet(this, _CTraderConnection_protobufReader, "f").getPayloadNameByType(type);
    }
    sendCommand(payloadName, data, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientMsgId = messageId !== null && messageId !== void 0 ? messageId : uuid_1.v1();
            const payloadType = this.getPayloadTypeByName(payloadName);
            const message = __classPrivateFieldGet(this, _CTraderConnection_protobufReader, "f").encode(payloadType, data !== null && data !== void 0 ? data : {}, clientMsgId);
            const responsePromise = __classPrivateFieldGet(this, _CTraderConnection_commandMap, "f").create({ clientMsgId, message, });
            if (payloadName.substr(-5).toUpperCase() === "EVENT") {
                const sentCommand = __classPrivateFieldGet(this, _CTraderConnection_commandMap, "f").extractById(clientMsgId);
                sentCommand.resolve({});
            }
            if (payloadName.substr(-3).toUpperCase() === "REQ") {
                const responsePayloadType = this.getPayloadTypeByName(`${payloadName.substr(0, payloadName.length - 3)}Res`);
                if (responsePayloadType === -1) {
                    const sentCommand = __classPrivateFieldGet(this, _CTraderConnection_commandMap, "f").extractById(clientMsgId);
                    sentCommand.resolve({});
                }
            }
            return responsePromise;
        });
    }
    trySendCommand(payloadName, data, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.sendCommand(payloadName, data, messageId);
            }
            catch (_a) {
                return undefined;
            }
        });
    }
    sendHeartbeat() {
        this.sendCommand("ProtoHeartbeatEvent");
    }
    open() {
        const connectionPromise = new Promise((resolve, reject) => {
            __classPrivateFieldSet(this, _CTraderConnection_resolveConnectionPromise, resolve, "f");
            __classPrivateFieldSet(this, _CTraderConnection_rejectConnectionPromise, reject, "f");
        });
        __classPrivateFieldGet(this, _CTraderConnection_socket, "f").connect();
        return connectionPromise;
    }
    close() {
        __classPrivateFieldGet(this, _CTraderConnection_socket, "f").disconnect();
    }
    on(payloadName, listener) {
        const payloadType = this.getPayloadTypeByName(payloadName).toString();
        if (!listener) {
            return __classPrivateFieldGet(this, _CTraderConnection_emitter, "f").on(payloadType);
        }
        return __classPrivateFieldGet(this, _CTraderConnection_emitter, "f").on(payloadType, listener);
    }
    removeEventListener(uuid) {
        __classPrivateFieldGet(this, _CTraderConnection_emitter, "f").removeEventListener(uuid);
    }
    static getAccessTokenProfile(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const URI = `https://api.spotware.com/connect/profile?access_token=${accessToken}`;
            return JSON.parse((yield axios_1.default.get(URI)).data);
        });
    }
    static getAccessTokenAccounts(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const URI = `https://api.spotware.com/connect/tradingaccounts?access_token=${accessToken}`;
            const parsedResponse = JSON.parse((yield axios_1.default.get(URI)).data);
            if (!Array.isArray(parsedResponse)) {
                return [];
            }
            return parsedResponse;
        });
    }
}
exports.CTraderConnection = CTraderConnection;
_CTraderConnection_commandMap = new WeakMap(), _CTraderConnection_encoderDecoder = new WeakMap(), _CTraderConnection_protobufReader = new WeakMap(), _CTraderConnection_socket = new WeakMap(), _CTraderConnection_emitter = new WeakMap(), _CTraderConnection_resolveConnectionPromise = new WeakMap(), _CTraderConnection_rejectConnectionPromise = new WeakMap(), _CTraderConnection_instances = new WeakSet(), _CTraderConnection_send = function _CTraderConnection_send(data) {
    __classPrivateFieldGet(this, _CTraderConnection_socket, "f").send(__classPrivateFieldGet(this, _CTraderConnection_encoderDecoder, "f").encode(data));
}, _CTraderConnection_onOpen = function _CTraderConnection_onOpen() {
    if (__classPrivateFieldGet(this, _CTraderConnection_resolveConnectionPromise, "f")) {
        __classPrivateFieldGet(this, _CTraderConnection_resolveConnectionPromise, "f").call(this);
    }
    __classPrivateFieldSet(this, _CTraderConnection_resolveConnectionPromise, undefined, "f");
    __classPrivateFieldSet(this, _CTraderConnection_rejectConnectionPromise, undefined, "f");
}, _CTraderConnection_onData = function _CTraderConnection_onData(data) {
    __classPrivateFieldGet(this, _CTraderConnection_encoderDecoder, "f").decode(data);
}, _CTraderConnection_onDecodedData = function _CTraderConnection_onDecodedData(data) {
    const payloadType = data.payloadType;
    const payload = data.payload;
    const clientMsgId = data.clientMsgId;
    const sentCommand = __classPrivateFieldGet(this, _CTraderConnection_commandMap, "f").extractById(clientMsgId);
    const normalizedPayload = JSON.parse(payload.encodeJSON());
    const payloadName = this.getPayloadNameByType(payloadType);
    if (clientMsgId) {
        normalizedPayload.clientMsgId = clientMsgId;
    }
    if (payloadName.substr(-5).toUpperCase() === "EVENT") {
        __classPrivateFieldGet(this, _CTraderConnection_instances, "m", _CTraderConnection_onPushEvent).call(this, payloadType, normalizedPayload);
    }
    else if (payloadName.substr(-3).toUpperCase() === "RES" && sentCommand) {
        if (typeof payload.errorCode === "string" || typeof payload.errorCode === "number") {
            sentCommand.reject(normalizedPayload);
        }
        else {
            sentCommand.resolve(normalizedPayload);
        }
    }
    else {
        console.log(`Unknown payload type ${payloadType}`);
    }
}, _CTraderConnection_onClose = function _CTraderConnection_onClose() {
}, _CTraderConnection_onPushEvent = function _CTraderConnection_onPushEvent(payloadType, message) {
    __classPrivateFieldGet(this, _CTraderConnection_emitter, "f").notifyListeners(payloadType.toString(), message);
};
//# sourceMappingURL=CTraderConnection.js.map