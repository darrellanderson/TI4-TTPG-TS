"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapStringHex = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Translate between map string index and hex position.
 *
 * Adapted from Somberlord's JavaScript code.
 */
class MapStringHex {
    static _firstIndexInRing(radius) {
        if (radius == 0) {
            return 0;
        }
        return 1 + (((radius - 1) * radius) / 2) * 6;
    }
    static _indexToRing(index) {
        let ring = 0;
        while (MapStringHex._firstIndexInRing(ring) <= index) {
            ring++;
        }
        return ring - 1;
    }
    /**
     * Translate a hex position to a map string index.
     *
     * @param hex
     * @returns
     */
    hexToIndex(hex) {
        const [q, r, s] = ttpg_darrell_1.Hex._hexFromString(hex);
        const radius = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
        if (radius > 0) {
            // Each ring has a size of radius * 6
            // Every hex on the ring is between offset and offset + radius*6
            // We split the ring into 6 sides. Each sides matches one coordinates
            // that is maxed out (positive or negative).  In each side, one coordinate
            // starts at zero, and increments to radius or -radius
            const firstIndexInRing = MapStringHex._firstIndexInRing(radius);
            switch (radius) {
                case -s:
                    return firstIndexInRing + r;
                case r:
                    return firstIndexInRing + radius - q;
                case -q:
                    return firstIndexInRing + 2 * radius + s;
                case s:
                    return firstIndexInRing + 3 * radius - r;
                case -r:
                    return firstIndexInRing + 4 * radius + q;
                case q:
                    return firstIndexInRing + 5 * radius - s;
            }
        }
        return 0;
    }
    /**
     * Translate a map string index to a hex position.
     *
     * @param index
     * @returns
     */
    indexToHex(index) {
        let q = 0;
        let r = 0;
        let s = 0;
        const radius = MapStringHex._indexToRing(index);
        if (radius > 0) {
            // Compute exact ring position, and side position
            // See hexToIdx for corresponding maths
            const firstIndexInRing = MapStringHex._firstIndexInRing(radius);
            const ringPosition = index - firstIndexInRing;
            const side = Math.floor(ringPosition / radius);
            const ringOffset = side * radius;
            const localPosition = ringPosition - ringOffset;
            // Compute hex coordinates from side and size position
            // One coordinates is maxed out to radius or -radius
            // One is local_position or -local_position
            // Sum of the 3 Cube coordinates must always be equal to zero
            switch (side) {
                case 0:
                    s = -radius;
                    r = localPosition;
                    q = -s - r;
                    break;
                case 1:
                    r = radius;
                    q = -localPosition;
                    s = -r - q;
                    break;
                case 2:
                    s = localPosition;
                    q = -radius;
                    r = -s - q;
                    break;
                case 3:
                    s = radius;
                    r = -localPosition;
                    q = -s - r;
                    break;
                case 4:
                    r = -radius;
                    q = localPosition;
                    s = -r - q;
                    break;
                case 5:
                    s = -localPosition;
                    q = radius;
                    r = -s - q;
                    break;
            }
        }
        return ttpg_darrell_1.Hex._hexToString(q, r, s);
    }
}
exports.MapStringHex = MapStringHex;
//# sourceMappingURL=map-string-hex.js.map