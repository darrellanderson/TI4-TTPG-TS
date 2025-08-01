import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
export declare const ACTION_YIN_ASCENDANT: string;
/**
 * "When you gain this card or score a public objective,
 * gain the alliance ability of a random, unused faction"
 */
export declare class RightClickYinAscendant extends AbstractRightClickCard {
    constructor();
    _yinAscendant(object: GameObject, player: Player): void;
    _getInUseAllianceCardNsids(): Array<string>;
}
