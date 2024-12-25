import {
  Border,
  ContentButton,
  HorizontalAlignment,
  LayoutBox,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { AbstractWrappedClickableUI } from "./abstract-wrapped-clickable-ui";

export const WRAPPED_BORDER_WIDTH: number = 4;

/**
 * Wrap an AbstractUI inside a ContentButton.
 */
export class WrappedClickableUI extends AbstractWrappedClickableUI {
  private readonly _innerUI: AbstractUI;
  private readonly _contentButton: ContentButton;
  private readonly _border: Border = new Border();

  constructor(ui: AbstractUI, scale: number) {
    const borderWidth: number = WRAPPED_BORDER_WIDTH * scale;

    // Add padding to inner UI before adding ContentButton.
    const innerSize: UI_SIZE = {
      w: ui.getSize().w + borderWidth * 2,
      h: ui.getSize().h + borderWidth * 2,
    };
    const innerBox: Widget = new LayoutBox()
      .setOverrideWidth(innerSize.w)
      .setOverrideHeight(innerSize.h)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(ui.getWidget());

    // Place inner UI insdie a ContentButton.  ContentButton adds 4 px padding.
    const contentButtonSize: UI_SIZE = {
      w: innerSize.w + 8,
      h: innerSize.h + 8,
    };
    const contentButton: ContentButton = new ContentButton().setChild(innerBox);

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

    this._innerUI = ui;
    this._contentButton = contentButton;
    this._border = border;
  }

  destroy(): void {
    this._innerUI.destroy();
    super.destroy();
  }

  getContentButton(): ContentButton {
    return this._contentButton;
  }

  getBorder(): Border {
    return this._border;
  }
}
