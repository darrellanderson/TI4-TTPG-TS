import { Adjacency, HexType } from "ttpg-darrell";
import { System } from "../system/system";
export type Direction = "n" | "nw" | "sw" | "s" | "se" | "ne";
export type DirectionToNeighborHexType = Record<Direction, HexType>;
export declare class SystemAdjacencyHyperlane {
    constructor();
    /**
     * Translate system tile rotation into neighbor index shift.
     * Expose for map string save.
     *
     * @param yaw
     * @returns
     */
    static yawToShift(yaw: number): number;
    static _getDirectionToNeighbor(neighbors: Array<HexType>): DirectionToNeighborHexType;
    /**
     * Compute system tile local direction to world edge.
     *
     * That is, "n" is north from the tile's rotated/flipped local perspective,
     * but may be any of the 6 directions in world space.
     *
     * @param system
     * @returns
     */
    static _localNeighborsWithRotAndFlip(system: System): DirectionToNeighborHexType;
    addTags(hexToSystem: Map<HexType, System>, adjacency: Adjacency): void;
}
