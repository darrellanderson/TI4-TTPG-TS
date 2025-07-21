"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseSlices = void 0;
class ParseSlices {
    constructor(sliceSize) {
        this._sliceSize = sliceSize;
    }
    parseSlices(config, errors) {
        let index;
        const prefix = "slices=";
        index = config.indexOf(prefix);
        if (index !== -1) {
            config = config.substring(index + prefix.length);
        }
        const suffix = "&";
        index = config.indexOf(suffix);
        if (index !== -1) {
            config = config.substring(0, index);
        }
        const entries = config
            .split("|")
            .filter((s) => s.length > 0);
        const slices = [];
        for (const entry of entries) {
            const tileNumberStrings = entry
                .split(/[, ]/)
                .filter((s) => s.length > 0);
            if (tileNumberStrings.length !== this._sliceSize) {
                errors.push(`slice "${entry}" has ${tileNumberStrings.length} tiles, expected ${this._sliceSize}`);
                continue;
            }
            const slice = tileNumberStrings.map((tileNumberString) => parseInt(tileNumberString));
            if (slice.includes(NaN)) {
                errors.push(`slice "${entry}" has invalid tile number`);
                continue;
            }
            slices.push(slice);
        }
        return slices.length > 0 ? slices : undefined;
    }
}
exports.ParseSlices = ParseSlices;
//# sourceMappingURL=parse-slices.js.map