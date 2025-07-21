"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_strategy_cards_1 = require("./layout-strategy-cards");
for (const obj of api_1.world.getAllObjects(true)) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
const z = api_1.world.getTableHeight();
const pos = new api_1.Vector(0, 0, z + 3);
const yaw = 0;
const layoutStrategyCards = new layout_strategy_cards_1.LayoutStrategyCards();
layoutStrategyCards.getLayout().doLayoutAtPoint(pos, yaw);
//# sourceMappingURL=layout-strategy-cards.testp.js.map