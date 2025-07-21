"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_unit_boxes_1 = require("./layout-unit-boxes");
for (const obj of api_1.world.getAllObjects(true)) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
const playerSlot = 11;
const pos = new api_1.Vector(0, 0, api_1.world.getTableHeight() + 1);
const yaw = 0;
process.nextTick(() => {
    new layout_unit_boxes_1.LayoutUnitBoxes(playerSlot).getLayout().doLayoutAtPoint(pos, yaw);
});
//# sourceMappingURL=layout-unit-boxes.testp.js.map