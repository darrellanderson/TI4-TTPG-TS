import { Card, GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class ReportRemaining implements IGlobal {
    private readonly _actionName;
    private readonly _customActionHandler;
    private readonly _prefixes;
    init(): void;
    _maybeAddContextMenuItem(obj: GameObject): void;
    getCardNamesWithCountsMessage(deck: Card): string;
    reportRemaining(deck: Card, player: Player): void;
}
