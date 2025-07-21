"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapStringFormat = void 0;
class MapStringFormat {
    _formatEntry(entry, index) {
        const parts = [entry.tile.toString()];
        if (entry.side !== undefined) {
            parts.push(entry.side);
            // Can only have rotation if side is present.
            if (entry.rot !== undefined) {
                parts.push(entry.rot.toString());
            }
        }
        const s = parts.join("");
        if (index === 0) {
            return `{${s}}`;
        }
        return s;
    }
    format(entries) {
        return entries
            .map((entry, index) => this._formatEntry(entry, index))
            .join(" ")
            .toUpperCase();
    }
}
exports.MapStringFormat = MapStringFormat;
//# sourceMappingURL=map-string-format.js.map