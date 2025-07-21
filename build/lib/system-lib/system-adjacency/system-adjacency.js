"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAdjacency = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const system_adjacency_hyperlane_1 = require("./system-adjacency-hyperlane");
const system_adjacency_neighbor_1 = require("./system-adjacency-neighbor");
const system_adjacency_wormhole_1 = require("./system-adjacency-wormhole");
class SystemAdjacency {
    constructor() {
        this._hyperlane = new system_adjacency_hyperlane_1.SystemAdjacencyHyperlane();
        this._neighbor = new system_adjacency_neighbor_1.SystemAdjacencyNeighbor();
        this._wormhole = new system_adjacency_wormhole_1.SystemAdjacencyWormhole();
    }
    static getHexToSystem() {
        const hexToSystem = new Map();
        const skipContained = true;
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs(skipContained)) {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            hexToSystem.set(hex, system);
        }
        return hexToSystem;
    }
    /**
     * Convert path to simplified list of nodes.
     * Intended for debugging and display.
     *
     * @param adjacencyNodePath
     * @returns
     */
    static simplifyPath(adjacencyNodePath) {
        const result = [];
        const first = adjacencyNodePath.path[0];
        if (first) {
            result.push(first.src);
        }
        for (const link of adjacencyNodePath.path) {
            result.push(link.dst);
        }
        return result;
    }
    /**
     * Node is either a HexType or a with-direction hex edge encoded as
     * "srcHex|dstHex".
     *
     * @param node
     * @returns
     */
    static adjNodeToPositionOrThrow(node) {
        const re = /^(<-?\d+,-?\d+,-?\d+>)\|?(<-?\d+,-?\d+,-?\d+>)?$/;
        const match = node.match(re);
        let srcHex;
        let dstHex;
        if (match) {
            const srcStr = match[1];
            if (srcStr) {
                srcHex = srcStr;
            }
            const dstStr = match[2];
            if (dstStr) {
                dstHex = dstStr;
            }
        }
        if (srcHex && dstHex) {
            const srcPos = TI4.hex.toPosition(srcHex);
            const dstPos = TI4.hex.toPosition(dstHex);
            return srcPos.add(dstPos).divide(2);
        }
        else if (srcHex) {
            return TI4.hex.toPosition(srcHex);
        }
        else {
            throw new Error(`Invalid node: ${node}`);
        }
    }
    /**
     * Get cooked adjacency results, just the adjacent hexes.
     * @param hex
     * @returns
     */
    getAdjHexes(hex, faction) {
        const adjHexes = new Set();
        const adjacencyPaths = this.getAdjacencyPaths(hex, faction);
        adjacencyPaths.forEach((adjacencyPath) => {
            if (adjacencyPath.distance === 1) {
                // Adjacency downgraded from HexType to string.
                // Verify node is HexType before using as one.
                const adjHex = adjacencyPath.node;
                if (ttpg_darrell_1.Hex._maybeHexFromString(adjHex)) {
                    adjHexes.add(adjHex);
                }
            }
        });
        adjHexes.delete(hex); // make sure hex is not included
        return adjHexes;
    }
    /**
     * Get the raw adjancency results, including path taken.
     * @param hex
     * @returns
     */
    getAdjacencyPaths(hex, faction) {
        const adjacency = new ttpg_darrell_1.Adjacency();
        const hexToSystem = SystemAdjacency.getHexToSystem();
        this._hyperlane.addTags(hexToSystem, adjacency);
        this._neighbor.addTags(hexToSystem, adjacency);
        this._wormhole.addTags(hexToSystem, adjacency, faction);
        this._neighbor.removeTags(adjacency); // adjacency blocking tokens
        return adjacency.get(hex, 1);
    }
}
exports.SystemAdjacency = SystemAdjacency;
//# sourceMappingURL=system-adjacency.js.map