import { Player, TextBox } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class StreamerToolUI extends AbstractUI {
    private readonly _ui;
    readonly _editableTimestampCommitted: (textBox: TextBox, _player: Player, _text: string, _usingEnter: boolean) => void;
    constructor(scale: number, playerSlot: PlayerSlot);
    destroy(): void;
}
