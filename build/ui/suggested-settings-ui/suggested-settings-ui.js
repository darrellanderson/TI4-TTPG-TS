"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestedSettingsUI = void 0;
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
const label_ui_1 = require("../button-ui/label-ui");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
class SuggestedSettingsUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const buildRow = (setting, low, high, bold = false) => {
            const settingUi = new label_ui_1.LabelUI(scale);
            settingUi.getText().setBold(bold).setText(setting);
            let valueText = low;
            if (high !== undefined) {
                valueText = low + " / " + high;
            }
            const valueUi = new label_ui_1.LabelUI(scale);
            valueUi.getText().setBold(bold).setText(valueText);
            return new horizontal_ui_builder_1.HorizontalUIBuilder()
                .setSpacing(config_1.CONFIG.SPACING * scale)
                .addUIs([settingUi, valueUi])
                .build();
        };
        const uis = [
            buildRow("SUGGEST SETTTING", "LOW-END", "HIGH-END", true),
            buildRow("Resolution scale", "100", "200"),
            buildRow("Anti-aliasing (FXAA)", "off", undefined),
            buildRow("Post processing", "low", "high"),
            buildRow("Shadow quality", "low", "high"),
            buildRow("Texture quality", "low", "high"),
            buildRow("Effect quality", "low", "high"),
            buildRow("VSync", "on", undefined),
            buildRow("Maximum framerate", "30", undefined),
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
exports.SuggestedSettingsUI = SuggestedSettingsUI;
//# sourceMappingURL=suggested-settings-ui.js.map