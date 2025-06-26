import { Text } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class LongLabelUI extends AbstractUI {
    private readonly _text;
    constructor(scaledWidth: number, scale: number);
    getText(): Text;
}
