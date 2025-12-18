"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTraderLayerUtilities = void 0;
class CTraderLayerUtilities {
    constructor() {
    }
    static isBrowser() {
        var _a;
        return typeof process === "undefined" || !((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node);
    }
}
exports.CTraderLayerUtilities = CTraderLayerUtilities;
//# sourceMappingURL=CTraderLayerUtilities.js.map