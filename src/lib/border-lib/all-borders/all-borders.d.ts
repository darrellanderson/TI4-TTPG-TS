import { DrawingLine } from "@tabletop-playground/api";
import { IGlobal, PlayerSlot } from "ttpg-darrell";
/**
 * Manage the actual control border DrawingLines.
 * DrawingLines persist across save/load/rewind so
 * we only need to update them in place.
 */
export declare class AllBorders implements IGlobal {
    private _visibleTo;
    private readonly _onTurnChangedHandler;
    static getAllDrawingLines(): Array<DrawingLine>;
    static removeAllDrawingLines(): void;
    constructor();
    init(): void;
    destroy(): void;
    _save(): void;
    _restore(): void;
    _updateLines(): void;
    isVisibleTo(playerSlot: PlayerSlot): boolean;
    toggleVisibility(playerSlot: PlayerSlot): void;
}
