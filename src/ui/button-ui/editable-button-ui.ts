import {
  Button,
  HorizontalBox,
  ImageButton,
  LayoutBox,
  TextBox,
  Widget,
  WidgetSwitcher,
} from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class EditableButtonUI extends AbstractUI {
  public onEdited = new TriggerableMulticastDelegate<(text: string) => void>();

  private readonly _button: Button;

  constructor(scale: number) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const button: Button = new Button()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setText("X");
    const edit: ImageButton = new ImageButton().setImageSize(size.h, size.h);
    const buttonPanel: Widget = new HorizontalBox()
      .addChild(button)
      .addChild(edit, 1);

    const editText: TextBox = new TextBox()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setText("X");

    const widget: Widget = new WidgetSwitcher()
      .addChild(buttonPanel)
      .addChild(editText);

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(widget);
    super(box, size);

    editText.onTextCommitted.add(() => {
      button.setText(editText.getText());

      this.onEdited.trigger(editText.getText());
    });

    this._button = button;
  }

  destroy(): void {
    this._button.onClicked.clear();
  }
}
