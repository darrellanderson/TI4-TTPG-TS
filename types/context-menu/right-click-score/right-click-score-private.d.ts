import { Card, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
/**
 * Score context menu item for cards that should move to
 * the player's scored area card-holer.
 */
export declare class RightClickScorePrivate implements IGlobal {
    private readonly _actionName;
    static isScorablePrivate(card: Card): boolean;
    private readonly _customActionHandler;
    init(): void;
    _maybeAddContextMenuItem(card: Card): void;
    score(card: Card, player: Player): void;
}
