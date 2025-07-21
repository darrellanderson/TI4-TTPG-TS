"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapStringParser = void 0;
/**
 * A map string is a text representation of system tile layout.
 * Normally "18" is assumed to be the center, then the first
 * map string entry is above it and winding clockwise.  Once back
 * to the "north" line bump out to the next ring and continue.
 *
 * A map string may have a first entry in curly braces {} to
 * override 18 as the center tile.
 *
 * Adapted from Dotlogix's JavaScript.
 */
class MapStringParser {
    constructor() {
        this._entryRegExp = /^([-]?\d+)([abAB]?)([012345]?)$/;
        this._overrideFirstRegExp = /^{(.*)}$/;
    }
    /**
     * Parse a single map string entry, "<number><side><rotation>".
     * Number is required, side and rotation are optional.
     *
     * @param raw
     * @returns
     */
    parseEntry(raw) {
        var _a;
        const result = { tile: -1 };
        const m = raw.match(this._entryRegExp);
        const tileStr = m === null || m === void 0 ? void 0 : m[1];
        const sideStr = (_a = m === null || m === void 0 ? void 0 : m[2]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const rotStr = m === null || m === void 0 ? void 0 : m[3];
        // If the regex matched tileStr will be defined.
        if (tileStr === undefined) {
            return undefined;
        }
        result.tile = parseInt(tileStr);
        if (sideStr === "a" || sideStr === "b") {
            result.side = sideStr;
        }
        if (rotStr) {
            const rot = parseInt(rotStr);
            if (rot === 0 ||
                rot === 1 ||
                rot === 2 ||
                rot === 3 ||
                rot === 4 ||
                rot === 5) {
                result.rot = rot;
            }
        }
        return result;
    }
    /**
     * Parse a map string, a space or comma separated list of entries.
     * Add any invalid entries to the invalidEntries array.
     *
     * @param mapString
     * @param invalidEntries
     * @returns
     */
    parse(mapString, invalidEntries) {
        const result = [];
        const rawEntries = mapString
            .split(/[ ,]/)
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0);
        // The first entry *may* be {4} or {4a1} in curly braces to signify
        // non-standard center tile.  If not, use Mecatol Rex (tile 18).
        const firstEntry = rawEntries[0];
        if (firstEntry) {
            const m = firstEntry.match(this._overrideFirstRegExp);
            const strippedFirst = m === null || m === void 0 ? void 0 : m[1];
            if (strippedFirst) {
                rawEntries[0] = strippedFirst;
            }
            else {
                rawEntries.unshift("18");
            }
        }
        for (const rawEntry of rawEntries) {
            const entry = this.parseEntry(rawEntry);
            if (entry) {
                result.push(entry);
            }
            else {
                invalidEntries.push(rawEntry);
            }
        }
        return result;
    }
    /**
     * Parse a map string, throw an error if any entries are invalid.
     *
     * @param mapString
     * @returns
     */
    parseOrThrow(mapString) {
        const invalidEntries = [];
        const result = this.parse(mapString, invalidEntries);
        if (invalidEntries.length > 0) {
            throw new Error(`Invalid map string entries: ${invalidEntries.join(", ")}`);
        }
        return result;
    }
}
exports.MapStringParser = MapStringParser;
//# sourceMappingURL=map-string-parser.js.map