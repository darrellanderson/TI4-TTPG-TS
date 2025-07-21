"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_sheets_1 = require("./layout-sheets");
for (const obj of api_1.world.getAllObjects(true)) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
const z = api_1.world.getTableHeight();
const pos = new api_1.Vector(0, 0, z + 3);
const yaw = 0;
new layout_sheets_1.LayoutSheets(1).getLayout().doLayoutAtPoint(pos, yaw);
//# sourceMappingURL=layout-sheets.testp.js.map