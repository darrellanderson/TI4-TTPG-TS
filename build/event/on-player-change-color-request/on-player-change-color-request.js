"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPlayerChangeColorRequest = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const change_color_ui_1 = require("../../ui/change-color-ui/change-color-ui");
class OnPlayerChangeColorRequest {
    constructor() {
        this._onCancelClickedHandler = (_button, _player) => {
            this._closeWindow();
        };
        this._onPlayerChangeColorRequestHandler = (targetPlayerSlot, clickingPlayer) => {
            this._closeWindow();
            const clickingPlayerName = clickingPlayer.getName();
            const msg = `${clickingPlayerName} clicked change player color`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            const createAbstractUi = (params) => {
                const changeColorUi = new change_color_ui_1.ChangeColorUI(targetPlayerSlot, params.scale);
                const cancelButton = changeColorUi.getCancelButton();
                cancelButton.onClicked.add(this._onCancelClickedHandler);
                return changeColorUi;
            };
            const namespaceId = undefined;
            const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUi, namespaceId, "Change Color");
            const window = abstractWindow.createWindow().attach();
            this._colorChangeWindow = window;
        };
        this._onPlayerChangedColorHandler = (_playerSlot, _colorName, _colorHex, _clickingPlayer) => {
            this._closeWindow();
        };
    }
    _closeWindow() {
        if (this._colorChangeWindow) {
            this._colorChangeWindow.detach();
            this._colorChangeWindow = undefined;
        }
    }
    init() {
        TI4.events.onPlayerChangeColorRequest.add(this._onPlayerChangeColorRequestHandler);
        TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColorHandler);
    }
    destroy() {
        TI4.events.onPlayerChangeColorRequest.remove(this._onPlayerChangeColorRequestHandler);
    }
}
exports.OnPlayerChangeColorRequest = OnPlayerChangeColorRequest;
//# sourceMappingURL=on-player-change-color-request.js.map