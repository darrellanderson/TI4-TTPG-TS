"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const anim_mid_table_1 = require("./anim-mid-table");
function go() {
    console.log("Starting AnimMidTable");
    new anim_mid_table_1.AnimMidTable().tour().then(() => {
        console.log("Animation complete");
    });
}
const actionName = "*Anim-table";
api_1.refObject.addCustomAction(actionName);
api_1.refObject.onCustomAction.add((_obj, _player, action) => {
    if (action === actionName) {
        go();
    }
});
//# sourceMappingURL=anim-mid-table.testp.js.map