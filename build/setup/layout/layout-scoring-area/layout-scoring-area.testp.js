"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_scoring_area_1 = require("./layout-scoring-area");
for (const obj of api_1.world.getAllObjects(true)) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
const z = api_1.world.getTableHeight();
const pos = new api_1.Vector(0, 0, z + 3);
const yaw = 0;
const layoutScoringArea = new layout_scoring_area_1.LayoutScoringArea(6);
layoutScoringArea.getLayout().doLayoutAtPoint(pos, yaw);
//# sourceMappingURL=layout-scoring-area.testp.js.map