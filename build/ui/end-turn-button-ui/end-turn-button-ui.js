"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndTurnButtonUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const packageId = api_1.refPackageId;
class EndTurnButtonUI {
    constructor() {
        const turnOrder = TI4.turnOrder;
        const params = {
            sound: "beep-ramp-up.flac",
            soundPackageId: packageId,
        };
        this._endTurnButton = new ttpg_darrell_1.EndTurnButton(turnOrder, params);
    }
    attachToScreen() {
        this._endTurnButton.attachToScreen();
        return this;
    }
    destroy() {
        this._endTurnButton.detach();
        this._endTurnButton.destroy();
    }
}
exports.EndTurnButtonUI = EndTurnButtonUI;
//# sourceMappingURL=end-turn-button-ui.js.map