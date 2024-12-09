import {
  Border,
  Color,
  ContentButton,
  HorizontalAlignment,
  LayoutBox,
  VerticalAlignment,
  Widget,
  world,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export const BORDER_WIDTH: number = 4;

/**
 * Wrap an AbstractUI inside a ContentButton.
 */
export class WrappedClickableUI extends AbstractUI {
  private readonly _contentButton: ContentButton;
  private readonly _border: Border = new Border();
  private _owningPlayerSlot: number = -1;

  constructor(ui: AbstractUI, scale: number) {
    const borderWidth: number = Math.ceil(BORDER_WIDTH * scale);

    // Place inner UI insdie a ContentButton.  ContentButton adds 4 px padding.
    const contentButtonSize: UI_SIZE = {
      w: ui.getSize().w + 8,
      h: ui.getSize().h + 8,
    };
    const contentButton: ContentButton = new ContentButton().setChild(
      ui.getWidget()
    );

    // Place inside an unsided LayoutBox with fixed padding.
    const borderSize: UI_SIZE = {
      w: contentButtonSize.w + borderWidth * 2,
      h: contentButtonSize.h + borderWidth * 2,
    };
    const contentButtonBox: Widget = new LayoutBox()
      .setPadding(borderWidth, borderWidth, borderWidth, borderWidth)
      .setChild(contentButton);
    const border: Border = new Border().setChild(contentButtonBox);
    const borderBox: Widget = new LayoutBox()
      .setOverrideWidth(borderSize.w)
      .setOverrideHeight(borderSize.h)
      .setChild(border);

    super(borderBox, borderSize);

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
