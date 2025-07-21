"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortEntityType = void 0;
class SortEntityType {
    sort(entityTypes) {
        entityTypes.sort((a, b) => {
            var _a, _b;
            // Sort by region.
            const aPlanetIndex = a.planetIndex;
            const bPlanetIndex = b.planetIndex;
            if (aPlanetIndex < bPlanetIndex) {
                return -1;
            }
            else if (aPlanetIndex > bPlanetIndex) {
                return 1;
            }
            // Attachments always last.
            const aAttachment = a.attachment ? 1 : 0;
            const bAttachment = b.attachment ? 1 : 0;
            if (aAttachment < bAttachment) {
                return -1;
            }
            else if (aAttachment > bAttachment) {
                return 1;
            }
            // Sort by color.
            const aColor = (_a = a.colorCode) !== null && _a !== void 0 ? _a : "";
            const bColor = (_b = b.colorCode) !== null && _b !== void 0 ? _b : "";
            if (aColor < bColor) {
                return -1;
            }
            else if (aColor > bColor) {
                return 1;
            }
            // Move tokens to back of region-color list.
            // (Why?  This is the way the other encoder did things, keep it.)
            const aToken = a.token ? 1 : 0;
            const bToken = b.token ? 1 : 0;
            if (aToken < bToken) {
                return -1;
            }
            else if (aToken > bToken) {
                return 1;
            }
            // Sort by increasing count.
            const aCount = a.count;
            const bCount = b.count;
            if (aCount < bCount) {
                return -1;
            }
            else if (aCount > bCount) {
                return 1;
            }
            // Arbitrary but consistent final tie breaker.
            const aCode = a.code;
            const bCode = b.code;
            if (aCode < bCode) {
                return -1;
            }
            return 1;
        });
    }
}
exports.SortEntityType = SortEntityType;
//# sourceMappingURL=sort-entity-type.js.map