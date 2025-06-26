import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "./button-ui";
/**
 * Wrap a FINISHED WITH SETUP button with a confirm button.
 */
export declare class ConfirmButtonUI extends AbstractUI {
    constructor(buttonUi: ButtonUI);
}
