export declare class DealActionCards {
    private readonly _cardUtil;
    private readonly _find;
    private readonly _playerSeats;
    getPlayerSlotToActionCardCount(): Map<number, number>;
    /**
     * Deal action cards to players.
     *
     * @returns Set of player slots that did not receive enough cards.
     */
    dealAllActionCards(): Set<number>;
    /**
     * Deal action cards to a player.
     *
     * @param playerSlot
     * @param count
     */
    dealActionCards(playerSlot: number, count: number): boolean;
}
