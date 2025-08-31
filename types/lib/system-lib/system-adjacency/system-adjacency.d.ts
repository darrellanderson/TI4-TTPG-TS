import { Vector } from "@tabletop-playground/api";
import { AdjacencyNodeType, AdjacencyPathType, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { Faction } from "../../faction-lib/faction/faction";
export declare class SystemAdjacency {
    private readonly _breach;
    private readonly _hyperlane;
    private readonly _ingress;
    private readonly _neighbor;
    private readonly _wormhole;
    static getHexToSystem(): Map<HexType, System>;
    /**
     * Convert path to simplified list of nodes.
     * Intended for debugging and display.
     *
     * @param adjacencyNodePath
     * @returns
     */
    static simplifyPath(adjacencyNodePath: AdjacencyPathType): Array<AdjacencyNodeType>;
    /**
     * Node is either a HexType or a with-direction hex edge encoded as
     * "srcHex|dstHex".
     *
     * @param node
     * @returns
     */
    static adjNodeToPositionOrThrow(node: AdjacencyNodeType): Vector;
    /**
     * Get cooked adjacency results, just the adjacent hexes.
     * @param hex
     * @returns
     */
    getAdjHexes(hex: HexType, faction: Faction | undefined): Set<HexType>;
    /**
     * Get the raw adjancency results, including path taken.
     * @param hex
     * @returns
     */
    getAdjacencyPaths(hex: HexType, faction: Faction | undefined): ReadonlyArray<AdjacencyPathType>;
}
