export declare class AddCommandTokens {
    private readonly _cardUtil;
    private readonly _find;
    private readonly _playerSeats;
    private readonly _recycleCardPromissory;
    getPlayerSlotToCommandTokenCount(): Map<number, number>;
    /**
     * Add command tokens for each player.
     *
     * @returns Set of player slots where not all tokens were added (too few).
     */
    addAllCommandTokens(): Set<number>;
    /**
     * Move command tokens from the container to above the command sheet.
     *
     * @param playerSlot
     * @param count
     * @returns
     */
    addCommandTokens(playerSlot: number, count: number): boolean;
}
