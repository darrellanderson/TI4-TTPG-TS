"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleStreamerTool = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const streamer_tool_ui_1 = require("../../ui/streamer-tool-ui/streamer-tool-ui");
class ToggleStreamerTool {
    init() {
        const createAbstractUI = (params) => {
            return new streamer_tool_ui_1.StreamerToolUI(params.scale, params.playerSlot);
        };
        const namespaceId = undefined;
        const windowTitle = "Streamer Tool";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
        abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale("tooltip.toggle-streamer-tool");
        abstractWindow.createWindow();
    }
}
exports.ToggleStreamerTool = ToggleStreamerTool;
//# sourceMappingURL=toggle-streamer-tool.js.map