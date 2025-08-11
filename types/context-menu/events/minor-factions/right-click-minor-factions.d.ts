import { Card, GameObject } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
export declare const ACTION_DEAL_HOME_SYSTEMS: string;
export declare const ACTION_DEAL_ALLIANCE_CARDS: string;
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
    _dealHomeSystemTiles(): Array<GameObject>;
    /**
     * Find minor faction home system tiles: home system tiles without a faction sheet.
     *
     * @param count
     * @returns
     */
    _findMinorFactionSystemTileObjs(): Array<GameObject>;
    static dealAllianceCards(systemTileObjs: Array<GameObject>): void;
    static _dealAllianceCard(card: Card | undefined, systemTileObj: GameObject): void;
    static enableExplorationTraits(systemTileObjs: Array<GameObject>): void;
    static _enableAllTraits(systemTileObj: GameObject): void;
}
