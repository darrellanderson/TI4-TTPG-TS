"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const right_click_rift_1 = require("./right-click-rift");
api_1.refObject.addCustomAction("rift yes");
api_1.refObject.addCustomAction("rift no");
api_1.refObject.onCustomAction.add((obj, _player, action) => {
    if (action === "rift yes") {
        right_click_rift_1.RightClickRift.applyRiftResult(obj, 10, 3);
    }
    else if (action === "rift no") {
        right_click_rift_1.RightClickRift.applyRiftResult(obj, 1, 3);
    }
});
//# sourceMappingURL=right-click-rift.testp.js.map