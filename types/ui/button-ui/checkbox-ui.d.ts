import { CheckBox } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class CheckBoxUI extends AbstractUI {
    private readonly _checkBox;
    constructor(scale: number);
    destroy(): void;
    getCheckBox(): CheckBox;
}
