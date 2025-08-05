import { GameObject, Vector } from "@tabletop-playground/api";
import { Adjacency, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { Faction } from "../../faction-lib/faction/faction";
export declare class SystemAdjacencyWormhole {
    private static __combatArenaObjId;
    static WORMHOMES: Array<string>;
    private readonly _cardUtil;
    private readonly _find;
    static getCombatArenaObj(): GameObject | undefined;
    /**
     * Get the hex for a position, with support for treating the
     * combat arena as the active system.
     *
     * @param pos
     * @returns
     */
    static getSystemHex(pos: Vector): HexType;
    addTags(hexToSystem: Map<HexType, System>, adjacency: Adjacency, faction: Faction | undefined): void;
    _applyFaction(faction: Faction, adjacency: Adjacency): void;
    _applyCreussFlagship(adjacency: Adjacency): void;
    _applyCards(adjacency: Adjacency): void;
}
