import { ContentButton } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class ColorChoiceButton extends AbstractUI {
    private readonly _contentButton;
    constructor(colorHex: string, scale: number);
    getContentButton(): ContentButton;
}
