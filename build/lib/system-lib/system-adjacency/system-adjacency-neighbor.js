"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAdjacencyNeighbor = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class SystemAdjacencyNeighbor {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    addTags(hexToSystem, adjacency) {
        // Create:
        // 1. Incoming links from hex edges to hex.
        // 2. Outgoing links from hex to hex edges.
        for (const [hex, system] of hexToSystem) {
            // "off-map" systems never have neighbors (not to be conused with
            // adjaency, which they can have via wormholes).  Hyperlanes do
            // not have outgoing neighbors in this sense, but are considered
            // to be neighbors of "normal" systems.
            if (system.getClass() === "off-map" || system.isHyperlane()) {
                continue; // hyperlanes are handled by SystemAdjacencyHyperlane
            }
            const neighbors = ttpg_darrell_1.Hex.neighbors(hex);
            for (const neighbor of neighbors) {
                const neighborSystem = hexToSystem.get(neighbor);
                if (neighborSystem && neighborSystem.getClass() === system.getClass()) {
                    // Incoming link from neighbor to hex.
                    const edgeIn = [neighbor, hex].join("|");
                    adjacency.addLink({
                        src: edgeIn,
                        dst: hex,
                        distance: 0.5,
                        isTransit: false,
                    });
                    // Outgoing link from hex to neighbor.
                    const edgeOut = [hex, neighbor].join("|");
                    adjacency.addLink({
                        src: hex,
                        dst: edgeOut,
                        distance: 0.5,
                        isTransit: true,
                    });
                }
            }
        }
    }
    /**
     * Some effects may block neighbor adjacency.  Bake those into a separate
     * "removeTags" method to apply after other tags have been added.
     *
     * @param hexToSystem
     * @param adjacency
     */
    removeTags(adjacency) {
        // Block neighbor adjacency by placing a token on the edge between them.
        const nsid = "token:hombrew.demo/neighbor-blocker";
        const blocker = this._find.findGameObject(nsid);
        if (blocker) {
            // Find two closest hexes, first is blocker hex.
            const pos = blocker.getPosition();
            const hex = TI4.hex.fromPosition(pos);
            const neighbors = ttpg_darrell_1.Hex.neighbors(hex);
            let best;
            let bestDSq = Infinity;
            for (const neighbor of neighbors) {
                const neighborPos = TI4.hex.toPosition(neighbor);
                const dSq = pos.subtract(neighborPos).magnitudeSquared();
                if (dSq < bestDSq) {
                    best = neighbor;
                    bestDSq = dSq;
                }
            }
            if (best) {
                // Remove all links between edge and the two hexes.
                const edgeA = [best, hex].join("|");
                adjacency.removeNode(edgeA);
                const edgeB = [hex, best].join("|");
                adjacency.removeNode(edgeB);
            }
        }
    }
}
exports.SystemAdjacencyNeighbor = SystemAdjacencyNeighbor;
//# sourceMappingURL=system-adjacency-neighbor.js.map