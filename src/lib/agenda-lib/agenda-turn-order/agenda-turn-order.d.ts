import { GameObject } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
export declare class AgendaTurnOrder {
    private readonly _find;
    _getSpeakerTokenOrThrow(): GameObject;
    _getSpeakerTokenSeatIndexOrThrow(): number;
    _getVotingDirection(): 1 | -1;
    _getZealPlayerSlots(): Array<PlayerSlot>;
    /**
     * "When" and "after" resolve order.
     *
     * [2.9] Players take turns resolving action cards starting with the
     * speaker and proceeding clockwise.
     *
     * @returns {Array.{PlayerDesk}}
     */
    getWhensOrAftersOrder(): Array<PlayerSlot>;
    /**
     * [8.2] Each player, starting with the player to the left of the
     * speaker and continuing clockwise, can cast votes for an outcome
     * of the current agenda.
     */
    getVotingOrder(): Array<PlayerSlot>;
}
