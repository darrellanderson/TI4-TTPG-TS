"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapStringSave = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const map_string_hex_1 = require("./map-string-hex");
const system_adjacency_hyperlane_1 = require("../../system-lib/system-adjacency/system-adjacency-hyperlane");
class MapStringSave {
    save() {
        const entries = [];
        const mapStringHex = new map_string_hex_1.MapStringHex();
        const skipContained = true;
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs(skipContained)) {
            // Ignore off-map systems.
            if (system.getClass() === "off-map") {
                continue;
            }
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            const idx = mapStringHex.hexToIndex(hex);
            // Ignore tiles way outside map.
            if (idx > 150) {
                continue;
            }
            const tileNumber = system.getSystemTileNumber();
            const side = ttpg_darrell_1.Facing.isFaceUp(system.getObj()) ? "A" : "B";
            const yaw = system.getObj().getRotation().yaw;
            const rot = system_adjacency_hyperlane_1.SystemAdjacencyHyperlane.yawToShift(yaw); // [0:5]
            if (system.isHome() && side === "B") {
                entries[idx] = "0";
            }
            else if (side === "A" && rot === 0) {
                entries[idx] = `${tileNumber}`;
            }
            else {
                entries[idx] = `${tileNumber}${side}${rot}`;
            }
        }
        // Fill in any missing entries with -1.
        for (let i = 0; i < entries.length; i++) {
            if (!entries[i]) {
                entries[i] = "-1";
            }
        }
        // 18 is the default start, prune it if there.
        // Otherwise mark the custom start as such.
        if (entries[0] === "18") {
            entries.shift();
        }
        else if (entries[0]) {
            entries[0] = `{${entries[0]}}`;
        }
        return entries.join(" ");
    }
}
exports.MapStringSave = MapStringSave;
//# sourceMappingURL=map-string-save.js.map