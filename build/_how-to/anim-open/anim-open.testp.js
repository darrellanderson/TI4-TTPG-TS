"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const anim_open_1 = require("./anim-open");
const actionName = "*Anim-open";
api_1.refObject.addCustomAction(actionName);
api_1.refObject.onCustomAction.add((_obj, player, action) => {
    if (action === actionName) {
        new anim_open_1.AnimOpen().go(player).then(() => {
            console.log("AnimOpen done");
        });
    }
});
//# sourceMappingURL=anim-open.testp.js.map