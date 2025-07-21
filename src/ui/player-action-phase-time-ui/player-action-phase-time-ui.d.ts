import { Widget } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class PlayerActionPhaseTimeUI extends AbstractUI {
    private readonly _roundToSeatIndexToTimeText;
    private intervalHandle;
    readonly _onInterval: () => void;
    static _formatTime(secondsTotal: number): string;
    constructor(scale: number);
    destroy(): void;
    _createInnerWidget(scale: number): Widget;
    update(): void;
    _updateRoundAndSeatIndex(round: number, seatIndex: number): void;
}
