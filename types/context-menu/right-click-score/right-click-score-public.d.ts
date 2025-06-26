import { Card, Player } from "@tabletop-playground/api";
/**
 * Score context menu for cards that receive control tokens;
 * they do NOT move the player's scored area card-holder.
 */
export declare class RightClickScorePublic {
    private readonly _actionName;
    static isScorablePublic(card: Card): boolean;
    private readonly _customActionHandler;
    init(): void;
    _maybeAddContextMenuItem(card: Card): void;
    score(card: Card, player: Player): void;
}
