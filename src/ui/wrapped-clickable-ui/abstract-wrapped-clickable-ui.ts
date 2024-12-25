import {
  Border,
  Color,
  ContentButton,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

/**
 * ContentButton based UI with a Border.  Border color is set based on
 * the owning player slot.
 */
export abstract class AbstractWrappedClickableUI extends AbstractUI {
  private _owningPlayerSlot: number = -1;

  abstract getContentButton(): ContentButton;
  abstract getBorder(): Border;

  constructor(widget: Widget, size: UI_SIZE) {
    super(widget, size);
  }

  getOwningPlayerSlot(): number {
    return this._owningPlayerSlot;
  }

  setOwningPlayerSlot(owningPlayerSlot: number | undefined): this {
    if (owningPlayerSlot === undefined) {
      owningPlayerSlot = -1;
    }
    this._owningPlayerSlot = owningPlayerSlot;

    let color: Color = new Color(0, 0, 0, 0);
    if (owningPlayerSlot !== -1) {
      color = world.getSlotColor(owningPlayerSlot);
    }
    this.getBorder().setColor(color);

    return this;
  }
}
