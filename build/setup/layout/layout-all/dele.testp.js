"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
// Right-click delete on a layout-all object does not always work,
// the object falls below the table and is not deleted.
for (const obj of api_1.world.getAllObjects()) {
    if (obj.getScriptFilename().includes("layout-all.testp")) {
        console.log("xxx", obj.getScriptFilename(), obj.getPosition().toString());
        obj.destroy();
    }
}
//# sourceMappingURL=dele.testp.js.map