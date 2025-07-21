import { RichText } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class LongRichTextUI extends AbstractUI {
    private readonly _richText;
    constructor(scaledWidth: number, scale: number);
    getRichText(): RichText;
}
