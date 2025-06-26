import { AbstractRightClickCard, PlayerSlot } from "ttpg-darrell";
export declare const MAGEON_IMPLANTS_NSID: string;
export declare const MAGEON_IMPLANTS_ACTION: string;
/**
 * Mageon Implants "card.technology.green:base/mageon-implants":
 * "ACTION: Exhaust this card to look at another player's hand of action cards.
 * Choose 1 of those cards and add it to your hand."
 */
export declare class RightClickMageonImplants extends AbstractRightClickCard {
    private readonly _find;
    constructor();
    getActionCardNames(playerSlot: PlayerSlot): string[];
    reportActionCardNames(clickingPlayerSlot: PlayerSlot, reportToPlayerSlot: PlayerSlot, actionCardNames: string[]): void;
}
