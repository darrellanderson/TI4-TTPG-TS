"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_player_area_1 = require("./layout-player-area");
for (const obj of api_1.world.getAllObjects(true)) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
const z = api_1.world.getTableHeight();
const pos = new api_1.Vector(0, 0, z + 3);
const yaw = 0;
const layoutPlayerArea = new layout_player_area_1.LayoutPlayerArea(1);
layoutPlayerArea.getLayout().doLayoutAtPoint(pos, yaw);
const size = layoutPlayerArea.getLayout().calculateSize();
console.log("size: " + size.w + " x " + size.h);
//# sourceMappingURL=layout-player-area.testp.js.map