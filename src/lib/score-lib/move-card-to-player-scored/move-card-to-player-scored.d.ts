import { Card, CardHolder } from "@tabletop-playground/api";
export declare class MoveCardToPlayerScored {
    _getPlayerScoringCardHolder(playerSlot: number): CardHolder | undefined;
    moveCard(card: Card, playerSlot: number): boolean;
}
