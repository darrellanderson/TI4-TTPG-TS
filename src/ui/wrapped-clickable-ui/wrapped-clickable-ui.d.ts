import { Border, ContentButton } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { AbstractWrappedClickableUI } from "./abstract-wrapped-clickable-ui";
export declare const WRAPPED_BORDER_WIDTH: number;
/**
 * Wrap an AbstractUI inside a ContentButton.
 */
export declare class WrappedClickableUI extends AbstractWrappedClickableUI {
    private readonly _innerUI;
    private readonly _contentButton;
    private readonly _border;
    constructor(ui: AbstractUI, scale: number);
    destroy(): void;
    getContentButton(): ContentButton;
    getBorder(): Border;
}
