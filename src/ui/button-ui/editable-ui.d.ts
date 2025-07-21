import { TextBox } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class EditableUI extends AbstractUI {
    private readonly _editText;
    constructor(scale: number);
    getEditText(): TextBox;
}
