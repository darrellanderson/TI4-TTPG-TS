"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmButtonUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
/**
 * Wrap a FINISHED WITH SETUP button with a confirm button.
 */
class ConfirmButtonUI extends abtract_ui_1.AbstractUI {
    constructor(buttonUi) {
        // Get button, remove from any parent.
        const innerButton = buttonUi.getButton();
        const parent = innerButton.getParent();
        if (parent && parent instanceof api_1.LayoutBox) {
            parent.setChild(undefined);
        }
        const confirmButton = new ttpg_darrell_1.ConfirmButton(innerButton);
        const size = buttonUi.getSize();
        const widget = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Fill)
            .setVerticalAlignment(api_1.VerticalAlignment.Fill)
            .setChild(confirmButton.getWidget());
        super(widget, size);
    }
}
exports.ConfirmButtonUI = ConfirmButtonUI;
//# sourceMappingURL=confirm-button-ui.js.map