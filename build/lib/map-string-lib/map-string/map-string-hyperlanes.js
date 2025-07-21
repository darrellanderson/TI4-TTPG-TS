"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapStringHyperlanes = void 0;
const map_string_parser_1 = require("./map-string-parser");
const map_string_hex_1 = require("./map-string-hex");
const map_string_format_1 = require("./map-string-format");
const HYPERLANES = {
    3: "{-1} 85A3 -1 85A5 -1 85A1 -1 -1 87A3 -1 88A5 -1 87A5 -1 87A3 -1 88A5 -1 88A3 86A3 84A3 -1 -1 -1 83A2 86A5 84A5 -1 -1 -1 84A3 86A1 83A2 -1 -1 -1 83A0",
    4: "{-1} 85A3 -1 -1 85A0 -1 -1 -1 88A1 -1 -1 -1 88A0 -1 87A0 -1 -1 -1 87A5 86A3 83A1 -1 -1 -1 -1 -1 -1 83A0 86A0 84A3 -1 -1 -1 -1 -1 -1 84A5",
    5: "{-1} -1 -1 -1 85A0 -1 -1 -1 -1 -1 -1 -1 88A0 -1 87A0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 83A0 86A0 84A3",
    7: "{-1} 85B3 -1 -1 84B3 90B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 88B3 -1 -1 -1 -1 -1 -1 86B3 -1 -1 -1 -1 -1 83B2",
    8: "{-1} 87A1 90B3 -1 88A2 89B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 85B2 -1 -1 -1 -1 -1 -1 -1 -1 83B2",
    // corners 7: "{-1} -1 -1 -1 -1 -1 -1 85A3 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 87A3 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 88A3 86A3 83A1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 84A5",
    // corners 8: "{-1} 87A1 90B3 -1 88A2 89B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 85B2 -1 -1 -1 -1 -1 -1 -1 -1 83B2",
};
class MapStringHyperlanes {
    static get(playerCount) {
        return HYPERLANES[playerCount] || "";
    }
    /**
     * Shift systems with an overlaying hyperlane to the closest open slot
     * (could be in another ring!), then apply the hyperlanes to the map string.
     *
     * @param mapString
     * @param playerCount
     * @returns
     */
    addHyperlanes(mapString, hyperlanesMapString) {
        const mapStringParser = new map_string_parser_1.MapStringParser();
        const mapStringArray = mapStringParser.parseOrThrow(mapString);
        const hyperlaneArray = mapStringParser.parseOrThrow(hyperlanesMapString);
        const maxIndex = Math.max(mapStringArray.length, hyperlaneArray.length);
        const open = new Set();
        const move = [];
        for (let index = 0; index < maxIndex; index++) {
            // Add hyperlane to map string.  If there is a tile there mark for move.
            const hyperlaneEntry = hyperlaneArray[index];
            if (hyperlaneEntry && hyperlaneEntry.tile > 0) {
                const mapStringEntry = mapStringArray[index];
                if (mapStringEntry && mapStringEntry.tile >= 0) {
                    move.push({ index, entry: mapStringEntry });
                }
                mapStringArray[index] = hyperlaneEntry;
            }
            // Keep track of open slots in the ring.
            const mapStringEntry = mapStringArray[index];
            if ((!hyperlaneEntry || hyperlaneEntry.tile <= 0) &&
                (!mapStringEntry || mapStringEntry.tile <= 0)) {
                open.add(index);
            }
        }
        // Keep shifting move entries to open spots until all are done.
        // Prioritize moving the shortest distance each pass.
        const mapStringHex = new map_string_hex_1.MapStringHex();
        while (move.length > 0) {
            let bestMoveIndex = undefined; // into the moveItem array, not map string
            let bestOpenIndex = undefined;
            let bestDistance = undefined;
            move.forEach((moveItem, moveIndex) => {
                const moveHex = mapStringHex.indexToHex(moveItem.index); // this is map string index
                const movePos = TI4.hex.toPosition(moveHex);
                for (const openIndex of open) {
                    const openHex = mapStringHex.indexToHex(openIndex);
                    const openPos = TI4.hex.toPosition(openHex);
                    let distance = movePos.subtract(openPos).magnitudeSquared();
                    // Prefer closer to center.
                    distance += openIndex / 100;
                    if (bestDistance === undefined || distance < bestDistance) {
                        bestMoveIndex = moveIndex;
                        bestOpenIndex = openIndex;
                        bestDistance = distance;
                    }
                }
                if (!bestDistance) {
                    throw new Error(`no open slot`);
                }
                if (bestOpenIndex !== undefined && bestMoveIndex !== undefined) {
                    mapStringArray[bestOpenIndex] = moveItem.entry;
                    move.splice(bestMoveIndex, 1);
                    open.delete(bestOpenIndex);
                }
            });
        }
        return new map_string_format_1.MapStringFormat().format(mapStringArray);
    }
}
exports.MapStringHyperlanes = MapStringHyperlanes;
//# sourceMappingURL=map-string-hyperlanes.js.map