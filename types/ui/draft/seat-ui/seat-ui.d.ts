import { AbstractUI } from "../../abstract-ui/abtract-ui";
export declare class SeatUI extends AbstractUI {
    static _getPlayerSlotOrThrow(seatIndex: number): number;
    static _getLabelOrThrow(seatIndex: number, speakerSeatIndex: number): string;
    constructor(seatIndex: number, speakerSeatIndex: number, scale: number);
}
