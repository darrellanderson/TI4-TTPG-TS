import {
  Button,
  HorizontalAlignment,
  LayoutBox,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { ConfirmButton } from "ttpg-darrell";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "./button-ui";

/**
 * Wrap a FINISHED WITH SETUP button with a confirm button.
 */
export class ConfirmButtonUI extends AbstractUI {
  constructor(buttonUi: ButtonUI) {
    // Get button, remove from any parent.
    const innerButton: Button = buttonUi.getButton();
    const parent: Widget | undefined = innerButton.getParent();
    if (parent && parent instanceof LayoutBox) {
      parent.setChild(undefined);
    }

    const confirmButton = new ConfirmButton(innerButton);

    const size: UI_SIZE = buttonUi.getSize();
    const widget: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setHorizontalAlignment(HorizontalAlignment.Fill)
      .setVerticalAlignment(VerticalAlignment.Fill)
      .setChild(confirmButton.getWidget());

    super(widget, size);
  }
}
