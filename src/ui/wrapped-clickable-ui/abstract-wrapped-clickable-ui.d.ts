import { Border, ContentButton, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
/**
 * ContentButton based UI with a Border.  Border color is set based on
 * the owning player slot.
 */
export declare abstract class AbstractWrappedClickableUI extends AbstractUI {
    private _owningPlayerSlot;
    abstract getContentButton(): ContentButton;
    abstract getBorder(): Border;
    constructor(widget: Widget, size: UI_SIZE);
    getOwningPlayerSlot(): number;
    setOwningPlayerSlot(owningPlayerSlot: number | undefined): this;
}
