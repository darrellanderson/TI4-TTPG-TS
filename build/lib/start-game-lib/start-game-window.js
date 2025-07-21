"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartGameWindow = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const start_game_ui_1 = require("../../ui/start-game-ui/start-game-ui");
class StartGameWindow {
    init() {
        if (TI4.config.timestamp > 0) {
            return; // already started
        }
        const createAbstractUI = (params) => {
            const ui = new start_game_ui_1.StartGameUI(params.scale);
            return ui;
        };
        const namespaceId = undefined;
        const windowTitle = "Start Game";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        const windowParams = abstractWindow.getMutableWindowParams();
        windowParams.disableClose = true;
        windowParams.disableWarpScreenWorld = true;
        // Turn order updates with config changes, pops to top of UIs.
        // Center horizontally.
        if (windowParams.screen) {
            windowParams.screen.anchor.u = 0.5;
            windowParams.screen.pos.u = 0.5;
        }
        // Unlike most windows, set this one up for all player slots.
        const playerSlots = Array.from({ length: 20 }, (_e, i) => i);
        const window = abstractWindow.createWindow(playerSlots);
        // Delay this window so other screen UIs can be created first.
        process.nextTick(() => {
            window.attach();
        });
        TI4.events.onStartGameRequest.add(() => {
            window.detach();
            window.destroy();
        });
    }
}
exports.StartGameWindow = StartGameWindow;
//# sourceMappingURL=start-game-window.js.map