"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_player_areas_1 = require("./layout-player-areas");
const setup_player_slot_colors_1 = require("../../setup-player-slot-colors/setup-player-slot-colors");
new setup_player_slot_colors_1.SetupPlayerSlotColors().setup();
for (const obj of api_1.world.getAllObjects(true)) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
for (const line of api_1.world.getDrawingLines()) {
    api_1.world.removeDrawingLineObject(line);
}
const z = api_1.world.getTableHeight();
const pos = new api_1.Vector(0, 0, z + 3);
const yaw = 0;
const layoutPlayerAreas = new layout_player_areas_1.LayoutPlayerAreas(6);
layoutPlayerAreas.getLayout().doLayoutAtPoint(pos, yaw);
const size = layoutPlayerAreas.getLayout().calculateSize();
console.log("size: " + size.w + " x " + size.h);
//# sourceMappingURL=layout-player-areas.testp.js.map