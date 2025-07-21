"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTestTableDeckSnapPoints = setupTestTableDeckSnapPoints;
const api_1 = require("@tabletop-playground/api");
const ttpg_mock_1 = require("ttpg-mock");
const layout_table_decks_1 = require("./layout-table-decks");
function setupTestTableDeckSnapPoints() {
    new ttpg_mock_1.MockGameObject({
        snapPoints: [
            new ttpg_mock_1.MockSnapPoint({
                tags: [
                    "deck-action",
                    "deck-agenda",
                    "deck-objective-secret",
                    "deck-planet",
                    "deck-legendary-planet",
                    "deck-faction-reference",
                    "deck-exploration-cultural",
                    "deck-exploration-industrial",
                    "deck-exploration-hazardous",
                    "deck-exploration-frontier",
                    "deck-event",
                    "deck-relic",
                ],
            }),
        ],
    });
}
it("constructor", () => {
    const pos = new api_1.Vector(0, 0, 0);
    const yaw = 0;
    expect(() => {
        new layout_table_decks_1.LayoutTableDecks().getLayout().doLayoutAtPoint(pos, yaw);
    }).toThrow();
    setupTestTableDeckSnapPoints();
    new layout_table_decks_1.LayoutTableDecks().getLayout().doLayoutAtPoint(pos, yaw);
});
//# sourceMappingURL=layout-table-decks.test.js.map