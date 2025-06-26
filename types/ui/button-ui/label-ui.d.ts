import { Text } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class LabelUI extends AbstractUI {
    private readonly _text;
    constructor(scale: number);
    getText(): Text;
}
