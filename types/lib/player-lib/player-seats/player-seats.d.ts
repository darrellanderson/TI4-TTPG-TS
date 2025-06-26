import { CardHolder, Vector } from "@tabletop-playground/api";
import { IGlobal, PlayerSlot } from "ttpg-darrell";
export type PlayerSeatType = {
    cardHolder: CardHolder;
    playerSlot: number;
};
export declare class PlayerSeats implements IGlobal {
    private _find;
    private readonly _onStartGameComplete;
    init(): void;
    /**
     * A readonable place to drop something in a player area.
     *
     * @param seatIndex
     * @returns
     */
    getDealPosition(playerSlot: PlayerSlot): Vector;
    getAllSeats(): Array<PlayerSeatType>;
    getPlayerSlotBySeatIndex(seatIndex: number): number;
    getPlayerSlotBySeatIndexOrThrow(seatIndex: number): number;
    getSeatIndexByPlayerSlot(playerSlot: number): number;
    getSeatIndexByPlayerSlotOrThrow(playerSlot: number): number;
    getCardHolderByPlayerSlot(playerSlot: number): CardHolder | undefined;
    getCardHolderByPlayerSlotOrThrow(playerSlot: number): CardHolder;
}
