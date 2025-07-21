import { Adjacency, HexType } from "ttpg-darrell";
import { System } from "../system/system";
export declare class SystemAdjacencyNeighbor {
    private readonly _find;
    constructor();
    addTags(hexToSystem: Map<HexType, System>, adjacency: Adjacency): void;
    /**
     * Some effects may block neighbor adjacency.  Bake those into a separate
     * "removeTags" method to apply after other tags have been added.
     *
     * @param hexToSystem
     * @param adjacency
     */
    removeTags(adjacency: Adjacency): void;
}
