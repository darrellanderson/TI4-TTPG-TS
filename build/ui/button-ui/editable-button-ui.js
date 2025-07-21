"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableButtonUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
const packageId = api_1.refPackageId;
class EditableButtonUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const button = new api_1.Button()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setText("X");
        const editText = new api_1.TextBox()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setText("X");
        const edit = new api_1.ImageButton()
            .setImage("ui/agenda/edit.png", packageId)
            .setImageSize(size.h, size.h);
        const widgetSwitcher = new api_1.WidgetSwitcher()
            .addChild(button)
            .addChild(editText);
        const panel = new api_1.HorizontalBox()
            .setChildDistance(0)
            .addChild(widgetSwitcher, 1)
            .addChild(edit, 0);
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(panel);
        super(box, size);
        this.onEdited = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._onEditClicked = (_button, _player) => {
            this._editText.setText(this._button.getText());
            if (this._widgetSwitcher.getActiveWidget() === this._button) {
                this._widgetSwitcher.setActiveWidget(this._editText);
            }
            else if (this._widgetSwitcher.getActiveWidget() === this._editText) {
                this._onEditTextCommitted();
            }
        };
        this._onEditTextCommitted = () => {
            this._button.setText(this._editText.getText());
            this._widgetSwitcher.setActiveWidget(this._button);
            this.onEdited.trigger(this._editText.getText());
        };
        editText.onTextCommitted.add(this._onEditTextCommitted);
        this._button = button;
        this._editText = editText;
        this._widgetSwitcher = widgetSwitcher;
        edit.onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(this._onEditClicked).get());
    }
    destroy() {
        this._button.onClicked.clear();
    }
    getButton() {
        return this._button;
    }
    /**
     * Expost the TextBox in order to restrict value types (e.g. numbers only).
     * @returns
     */
    getTextBox() {
        return this._editText;
    }
    getWidgetSwitcher() {
        return this._widgetSwitcher;
    }
}
exports.EditableButtonUI = EditableButtonUI;
//# sourceMappingURL=editable-button-ui.js.map