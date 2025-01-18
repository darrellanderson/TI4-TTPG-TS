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

  readonly _onEditClicked = (): void => {
    this._editText.setText(this._button.getText());
    if (this._widgetSwitcher.getActiveWidget() === this._button) {
      this._widgetSwitcher.setActiveWidget(this._editText);
    } else if (this._widgetSwitcher.getActiveWidget() === this._editText) {
      this._onEditTextCommitted();
    }
  };

  readonly _onEditTextCommitted = (): void => {
    this._button.setText(this._editText.getText());
    this._widgetSwitcher.setActiveWidget(this._button);
    this.onEdited.trigger(this._editText.getText());
  };

  private readonly _button: Button;
  private readonly _editText: TextBox;
  private readonly _widgetSwitcher: WidgetSwitcher;

  constructor(scale: number) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const button: Button = new Button()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setText("X");

    const editText: TextBox = new TextBox()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setText("X");

    const edit: ImageButton = new ImageButton()
      .setImage("ui/agenda/edit.png")
      .setImageSize(size.h, size.h);

    const widgetSwitcher: WidgetSwitcher = new WidgetSwitcher()
      .addChild(button)
      .addChild(editText);

    const panel: Widget = new HorizontalBox()
      .addChild(widgetSwitcher, 1)
      .addChild(edit, 0);

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(panel);
    super(box, size);

    editText.onTextCommitted.add(this._onEditTextCommitted);

    this._button = button;
    this._editText = editText;
    this._widgetSwitcher = widgetSwitcher;

    edit.onClicked.add(this._onEditClicked);
  }

  destroy(): void {
    this._button.onClicked.clear();
  }

  getButton(): Button {
    return this._button;
  }

  /**
   * Expost the TextBox in order to restrict value types (e.g. numbers only).
   * @returns
   */
  getTextBox(): TextBox {
    return this._editText;
  }

  getWidgetSwitcher(): WidgetSwitcher {
    return this._widgetSwitcher;
  }
}
