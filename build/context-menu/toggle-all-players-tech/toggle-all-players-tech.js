"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleAllPlayersTech = void 0;
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const all_players_techs_ui_1 = require("../../ui/all-players-techs.ui/all-players-techs-ui");
class ToggleAllPlayersTech {
    constructor() {
        this._gameData = { players: [] };
        this._windowMaxTech = 0;
        this._onGameData = (gameData) => {
            this._gameData = gameData;
            let maxTech = 0;
            gameData.players.forEach((player) => {
                if (player.technologies) {
                    maxTech = Math.max(player.technologies.length, maxTech);
                }
            });
            if (this._abstractWindow && this._windowMaxTech !== maxTech) {
                this._abstractWindow.invalidateSize();
            }
        };
    }
    init() {
        const createAbstractUI = (params) => {
            return new all_players_techs_ui_1.AllPlayersTechsUI(params.scale, this._gameData);
        };
        const namespaceId = undefined;
        const windowTitle = "All Players Techs";
        this._abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        this._abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
        this._abstractWindow.getMutableWindowParams().addToggleMenuTooltip =
            TI4.locale("tooltip.toggle-all-players-tech");
        // Unlike most windows, set this one up for all player slots.
        const playerSlots = Array.from({ length: 20 }, (_e, i) => i);
        this._abstractWindow.createWindow(playerSlots);
        TI4.events.onGameData.add(this._onGameData);
    }
}
exports.ToggleAllPlayersTech = ToggleAllPlayersTech;
//# sourceMappingURL=toggle-all-players-tech.js.map