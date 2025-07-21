"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleHelp = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const help_with_extras_ui_1 = require("../../ui/help-ui/help-with-extras-ui");
class ToggleHelp {
    init() {
        const createAbstractUI = (params) => {
            return new help_with_extras_ui_1.HelpWithExtrasUI(params.scale);
        };
        const namespaceId = undefined;
        const windowTitle = "Help";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
        abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale("tooltip.toggle-help");
        // Unlike most windows, set this one up for all player slots.
        const playerSlots = Array.from({ length: 20 }, (_e, i) => i);
        abstractWindow.createWindow(playerSlots);
    }
}
exports.ToggleHelp = ToggleHelp;
//# sourceMappingURL=toggle-help.js.map