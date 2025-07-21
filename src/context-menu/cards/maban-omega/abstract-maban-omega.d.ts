import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard, PlayerSlot } from "ttpg-darrell";
export declare const MABAN_OMEGA_ACTION_NAME: string;
/**
 * Naalu commander omega "card.leader.commander:codex.vigil/maban.omega"
 * (and "card.alliance:codex.vigil/naalu.omega"):
 * "At any time: You may look at your neighbors' hands of promissory notes
 * and the top and bottom card of the agenda deck"
 */
export declare abstract class AbstractMabanOmega extends AbstractRightClickCard {
    private readonly _find;
    constructor(cardNsid: string);
    isCommanderActive(): boolean;
    isOwningPlayer(object: GameObject, player: Player): boolean;
    getNeighboringPlayerSlots(player: Player): Array<PlayerSlot>;
    getPromissoryNotes(playerSlot: PlayerSlot): Array<string>;
    getAgendaDeckTopBottom(): {
        top: string;
        bottom: string;
    } | undefined;
    doMabanOmegaAction(object: GameObject, player: Player): void;
}
