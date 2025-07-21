"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAdjacencyHyperlane = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class SystemAdjacencyHyperlane {
    constructor() { }
    /**
     * Translate system tile rotation into neighbor index shift.
     * Expose for map string save.
     *
     * @param yaw
     * @returns
     */
    static yawToShift(yaw) {
        yaw = yaw % 360; // [-360:360]
        yaw = (yaw + 360) % 360; // [0:360]
        return Math.round(yaw / 60) % 6; // [0:5]
    }
    static _getDirectionToNeighbor(neighbors) {
        const n = neighbors[0];
        const nw = neighbors[1];
        const sw = neighbors[2];
        const s = neighbors[3];
        const se = neighbors[4];
        const ne = neighbors[5];
        // Make sure TypeScript knows all the values are defined.
        if (!n || !nw || !sw || !s || !se || !ne || neighbors.length !== 6) {
            throw new Error("neighbors must have 6 elements");
        }
        return {
            n,
            nw,
            sw,
            s,
            se,
            ne,
        };
    }
    /**
     * Compute system tile local direction to world edge.
     *
     * That is, "n" is north from the tile's rotated/flipped local perspective,
     * but may be any of the 6 directions in world space.
     *
     * @param system
     * @returns
     */
    static _localNeighborsWithRotAndFlip(system) {
        const systemTileObj = system.getObj();
        const yaw = systemTileObj.getRotation().yaw;
        const yawShiftCount = SystemAdjacencyHyperlane.yawToShift(yaw);
        const hex = TI4.hex.fromPosition(systemTileObj.getPosition());
        const neighbors = ttpg_darrell_1.Hex.neighbors(hex);
        // Shift neighbors to match local orientation.
        for (let i = 0; i < yawShiftCount; i++) {
            neighbors.unshift(neighbors.pop());
        }
        // Extract the shifted hexes in local directions.
        return SystemAdjacencyHyperlane._getDirectionToNeighbor(neighbors);
    }
    addTags(hexToSystem, adjacency) {
        for (const [hex, system] of hexToSystem.entries()) {
            if (!system.isHyperlane()) {
                continue;
            }
            // Get mapping to neighbors, accounting for rotated and flipped.
            const localNeighbors = SystemAdjacencyHyperlane._localNeighborsWithRotAndFlip(system);
            const hyperlanes = system.getHyperlanes();
            for (const [srcDir, dstDirs] of Object.entries(hyperlanes)) {
                const srcNeighbor = localNeighbors[srcDir];
                if (srcNeighbor) {
                    const srcEdge = [srcNeighbor, hex].join("|");
                    for (const dstDir of dstDirs) {
                        const dstNeighbor = localNeighbors[dstDir];
                        if (dstNeighbor) {
                            const dstEdge = [hex, dstNeighbor].join("|");
                            const link = {
                                src: srcEdge,
                                dst: dstEdge,
                                distance: 0,
                                isTransit: true,
                            };
                            //console.log(JSON.stringify(link));
                            adjacency.addLink(link);
                        }
                    }
                }
            }
        }
    }
}
exports.SystemAdjacencyHyperlane = SystemAdjacencyHyperlane;
//# sourceMappingURL=system-adjacency-hyperlane.js.map