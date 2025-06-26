import { Adjacency, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { Faction } from "../../faction-lib/faction/faction";
export declare class SystemAdjacencyWormhole {
    static WORMHOMES: Array<string>;
    private readonly _cardUtil;
    private readonly _find;
    addTags(hexToSystem: Map<HexType, System>, adjacency: Adjacency, faction: Faction | undefined): void;
    _applyFaction(faction: Faction, adjacency: Adjacency): void;
    _applyCreussFlagship(adjacency: Adjacency): void;
    _applyCards(adjacency: Adjacency): void;
}
