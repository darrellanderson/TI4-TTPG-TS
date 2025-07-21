"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleStats = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const stats_ui_1 = require("../../ui/stats-ui/stats-ui");
class ToggleStats {
    constructor() {
        this._lastGameData = { players: [] };
        this._onGameData = (gameData) => {
            this._lastGameData = gameData;
        };
    }
    init() {
        const createAbstractUI = (params) => {
            const statsUi = new stats_ui_1.StatsUI(params.scale);
            statsUi.update(this._lastGameData);
            return statsUi;
        };
        const namespaceId = "@context-menu/toggle-stats";
        const windowTitle = "Stats";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        const params = abstractWindow.getMutableWindowParams();
        params.addToggleMenuItem = true;
        params.addToggleMenuTooltip = TI4.locale("tooltip.toggle-stats");
        if (params.screen) {
            params.screen.anchor.v = 1;
            params.screen.pos.v = 0.95;
        }
        abstractWindow.createWindow();
        TI4.events.onGameData.add(this._onGameData);
    }
}
exports.ToggleStats = ToggleStats;
//# sourceMappingURL=toggle-stats.js.map