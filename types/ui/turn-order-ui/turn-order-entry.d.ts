import { Color } from "@tabletop-playground/api";
import { TurnEntryWart, TurnEntryWidget } from "ttpg-darrell";
export declare class TurnOrderEntry extends TurnEntryWart {
    private readonly _scoreboard;
    private readonly _factionIcon;
    private readonly _factionName;
    private readonly _score;
    private readonly _strategyCardSolo;
    private readonly _strategyCardSoloOverlay;
    private readonly _strategyCardLeft;
    private readonly _strategyCardLeftOverLay;
    private readonly _strategyCardRight;
    private readonly _strategyCardRightOverLay;
    constructor(turnEntryWidget: TurnEntryWidget);
    destroy(): void;
    _updatePlayerSlotToFaction(): void;
    _updatePlayerSlotToScore(): void;
    _updatePlayerSlotToStrategyCards(): void;
    update(playerSlot: number, fgColor: Color, _bgColor: Color): void;
}
