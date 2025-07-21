import { GameObject } from "@tabletop-playground/api";
/**
 * Return command tokens on system tiles to players' supplies.
 */
export declare class ReturnCommandTokens {
    private readonly _recycleCommandToken;
    getAllCommandTokensOnMap(): Array<GameObject>;
    /**
     * Return command tokens for only one player (for Sol's hero).
     *
     * @param playerSlot
     */
    returnOnePlayersCommandTokens(playerSlot: number): void;
    returnAllCommandTokens(): void;
}
