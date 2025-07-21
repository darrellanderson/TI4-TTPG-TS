"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleMapTool = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const map_tool_ui_1 = require("../../ui/map-tool-ui/map-tool-ui");
class ToggleMapTool {
    init() {
        const createAbstractUI = (params) => {
            return new map_tool_ui_1.MapToolUI(params.scale);
        };
        const namespaceId = "@context-menu/toggle-map-tool";
        const windowTitle = "Map Tool";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
        abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale("tooltip.toggle-map-tool");
        abstractWindow.createWindow();
    }
}
exports.ToggleMapTool = ToggleMapTool;
//# sourceMappingURL=toggle-map-tool.js.map