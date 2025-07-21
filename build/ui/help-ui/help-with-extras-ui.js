"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpWithExtrasUI = void 0;
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const suggested_settings_ui_1 = require("../suggested-settings-ui/suggested-settings-ui");
const help_ui_1 = require("./help-ui");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const config_1 = require("../config/config");
const div_ui_1 = require("../div-ui/div-ui");
const suggested_key_unbinds_ui_1 = require("../suggested-key-unbinds-ui/suggested-key-unbinds-ui");
class HelpWithExtrasUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const suggestedKeyUnbindsUI = new suggested_key_unbinds_ui_1.SuggestedKeyUnbindsUI(scale);
        const suggestedSettings = new suggested_settings_ui_1.SuggestedSettingsUI(scale);
        const helpUi = new help_ui_1.HelpUI(scale);
        const h = Math.max(suggestedKeyUnbindsUI.getSize().h, suggestedSettings.getSize().h, helpUi.getSize().h);
        const uis = [
            new suggested_key_unbinds_ui_1.SuggestedKeyUnbindsUI(scale),
            new div_ui_1.DivUI(scale, h, "vertical"),
            new suggested_settings_ui_1.SuggestedSettingsUI(scale),
            new div_ui_1.DivUI(scale, h, "vertical"),
            new help_ui_1.HelpUI(scale),
        ];
        const ui = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale * 2)
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
exports.HelpWithExtrasUI = HelpWithExtrasUI;
//# sourceMappingURL=help-with-extras-ui.js.map