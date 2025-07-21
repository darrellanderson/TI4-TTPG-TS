"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_table_decks_1 = require("./layout-table-decks");
for (const obj of api_1.world.getAllObjects(true)) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
const z = api_1.world.getTableHeight();
const pos = new api_1.Vector(0, 0, z + 3);
const yaw = 0;
const layoutTableDecks = new layout_table_decks_1.LayoutTableDecks();
layoutTableDecks.getLayout().doLayoutAtPoint(pos, yaw);
//# sourceMappingURL=layout-table-decks.testp.js.map