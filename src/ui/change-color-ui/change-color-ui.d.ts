import { Button, ContentButton, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class ChangeColorUI extends AbstractUI {
    private readonly _cancelButton;
    static _getAllColorNames(): Array<string>;
    static _getClickHandler(targetPlayerSlot: number, colorName: string, colorHex: string): (button: ContentButton, player: Player) => void;
    static _getColorRow(colorName: string, targetPlayerSlot: number, scale: number): AbstractUI;
    constructor(targetPlayerSlot: number, scale: number);
    getCancelButton(): Button;
}
