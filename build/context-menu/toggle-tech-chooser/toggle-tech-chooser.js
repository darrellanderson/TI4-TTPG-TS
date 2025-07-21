"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleTechChooser = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const choose_technology_ui_1 = require("../../ui/choose-technology-ui/choose-technology-ui");
class ToggleTechChooser {
    constructor() {
        this._techChooserWindow = undefined;
        // Toggles window.
        this._onTechChooserRequestHandler = (playerSlot) => {
            if (this._techChooserWindow) {
                this._techChooserWindow.toggleForPlayer(playerSlot);
            }
        };
    }
    init() {
        const createAbstractUI = (params) => {
            return new choose_technology_ui_1.ChooseTechnologyUI(params.scale, params.playerSlot);
        };
        const namespaceId = "@context-menu/toggle-tech-chooser";
        const windowTitle = "Tech Chooser";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
        abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale("tooltip.toggle-tech-chooser");
        this._techChooserWindow = abstractWindow.createWindow();
        // Listen for the request event.
        TI4.events.onTechChooserRequest.add(this._onTechChooserRequestHandler);
    }
}
exports.ToggleTechChooser = ToggleTechChooser;
//# sourceMappingURL=toggle-tech-chooser.js.map