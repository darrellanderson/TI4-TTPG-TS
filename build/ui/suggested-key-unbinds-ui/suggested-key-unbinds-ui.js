"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestedKeyUnbindsUI = void 0;
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
const label_ui_1 = require("../button-ui/label-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
class SuggestedKeyUnbindsUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const buildRow = (value, bold = false) => {
            const labelUi = new label_ui_1.LabelUI(scale);
            labelUi.getText().setBold(bold).setText(value);
            return labelUi;
        };
        const uis = [
            buildRow("SUGGEST KEY UNBIND", true),
            buildRow("Switch Camera (z)"),
            buildRow("Measure Mode (m)"),
            buildRow("Measure Movement (x)"),
            buildRow("Ground Mode (g)"),
            buildRow("Zone mode (u)"),
            buildRow("Draw mode (i)"),
            buildRow("Label mode (k)"),
            buildRow("Hide/show cards (c)"),
            buildRow("Toggle history (h)"),
        ];
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(uis)
            .build();
        super(ui.getWidget(), ui.getSize());
        this._ui = ui;
    }
    destroy() {
        this._ui.destroy();
        super.destroy();
    }
}
exports.SuggestedKeyUnbindsUI = SuggestedKeyUnbindsUI;
//# sourceMappingURL=suggested-key-unbinds-ui.js.map