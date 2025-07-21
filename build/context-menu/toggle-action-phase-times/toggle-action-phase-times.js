"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleActionPhaseTimes = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const player_action_phase_time_ui_1 = require("../../ui/player-action-phase-time-ui/player-action-phase-time-ui");
class ToggleActionPhaseTimes {
    constructor() {
        this._gameData = { players: [] };
        this._onGameData = (gameData) => {
            this._gameData = gameData;
        };
    }
    init() {
        const createAbstractUI = (params) => {
            return new player_action_phase_time_ui_1.PlayerActionPhaseTimeUI(params.scale);
        };
        const namespaceId = undefined;
        const windowTitle = "Action Phase Time";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
        abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale("tooltip.toggle-action-phase-timers");
        // Unlike most windows, set this one up for all player slots.
        const playerSlots = Array.from({ length: 20 }, (_e, i) => i);
        abstractWindow.createWindow(playerSlots);
        TI4.events.onGameData.add(this._onGameData);
    }
}
exports.ToggleActionPhaseTimes = ToggleActionPhaseTimes;
//# sourceMappingURL=toggle-action-phase-times.js.map