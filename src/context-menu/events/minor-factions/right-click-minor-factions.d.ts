import { GameObject } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
export declare const MINOR_FACTIONS_ACTION_NAME: string;
/**
 * Give each player:
 * - one unused home system,
 * - linked alliance card,
 * - 3 neutral infantry
 *
 * Minor faction planets have all traits.
 */
export declare class RightClickMinorFactions extends AbstractRightClickCard {
    constructor();
    _getInPlayFactionHomeSystemNsids(): Set<string>;
    _getAllHomeSystemTileNsids(): Set<string>;
    _getAvailableHomeSystemNsids(): Array<string>;
    _getHomeSystemTiles(count: number): Array<GameObject>;
    _dealHomeSystemTiles(): void;
}
