import {
  Border,
  Color,
  ContentButton,
  LayoutBox,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export const BORDER_SIZE: number = 4;

/**
 * Wrap an AbstractUI inside a ContentButton.
 */
export class WrappedClickableUI extends AbstractUI {
  private readonly _contentButton: ContentButton;
  private readonly _border: Border = new Border();
  private _owningPlayerSlot: number = -1;

  constructor(ui: AbstractUI, scale: number) {
    const size: UI_SIZE = ui.getSize();
    size.w += BORDER_SIZE * 2 * scale + 16;
    size.h += BORDER_SIZE * 2 * scale + 16;

    const child: Widget = ui.getWidget();

    const contentButton: ContentButton = new ContentButton().setChild(child);
    const contentBox: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setPadding(
        BORDER_SIZE * scale,
        BORDER_SIZE * scale,
        BORDER_SIZE * scale,
        BORDER_SIZE * scale
      )
      .setChild(contentButton);

    const border = new Border().setChild(contentBox);

    const widget: Widget = border;

    super(widget, size);
    this._contentButton = contentButton;
    this._border = border;
  }

  getContentButton(): ContentButton {
    return this._contentButton;
  }

  getBorder(): Border {
    return this._border;
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
    this._border.setColor(color);

    return this;
  }
}
