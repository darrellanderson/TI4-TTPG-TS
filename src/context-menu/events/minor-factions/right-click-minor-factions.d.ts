import { Card, GameObject } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
import { System } from "../../../lib/system-lib/system/system";
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
    static dealAllianceCards(systemTileObjs: Array<GameObject>): void;
    static _dealAllianceCard(card: Card | undefined, systemTileObj: GameObject): void;
    static _enableAllTraits(system: System): void;
}
