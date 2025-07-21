import { Card } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare const ACTION_PLACE_TOP: string;
export declare const ACTION_PLACE_BOTTOM: string;
export declare class RightClickAgenda implements IGlobal {
    private readonly _find;
    private readonly _onSingletonCardCreated;
    private readonly _onSingletonCardMadeDeck;
    private readonly _onCustomAction;
    private readonly _onStrategyCardPlayed;
    _getAgendaDeck(): Card | undefined;
    _clearAgendaDeckDescription(): void;
    _addAgendaDeckDescription(value: string): void;
    init(): void;
    _place(isTop: boolean, card: Card): void;
}
