"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const draft_start_window_1 = require("./draft-start-window");
function go() {
    var _a;
    const draftStartWindow = new draft_start_window_1.DraftStartWindow();
    const playerSlot = (_a = api_1.world.getAllPlayers()[0]) === null || _a === void 0 ? void 0 : _a.getSlot();
    if (playerSlot === undefined) {
        throw new Error("No player slot found");
    }
    draftStartWindow.createAndAttachWindow(10);
}
setTimeout(go, 100);
//# sourceMappingURL=draft-start-window.testp.js.map