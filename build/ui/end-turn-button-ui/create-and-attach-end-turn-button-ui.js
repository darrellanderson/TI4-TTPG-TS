"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAndAttachEndTurnButtonUI = void 0;
const end_turn_button_ui_1 = require("./end-turn-button-ui");
class CreateAndAttachEndTurnButtonUI {
    constructor() {
        this._endTurnButtonUI = new end_turn_button_ui_1.EndTurnButtonUI();
    }
    init() {
        this._endTurnButtonUI.attachToScreen();
    }
    destroy() {
        this._endTurnButtonUI.destroy();
    }
}
exports.CreateAndAttachEndTurnButtonUI = CreateAndAttachEndTurnButtonUI;
//# sourceMappingURL=create-and-attach-end-turn-button-ui.js.map