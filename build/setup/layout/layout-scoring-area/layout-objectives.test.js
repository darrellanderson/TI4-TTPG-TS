"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTestObjectivesSnapPoints = setupTestObjectivesSnapPoints;
const api_1 = require("@tabletop-playground/api");
const ttpg_mock_1 = require("ttpg-mock");
const layout_objectives_1 = require("./layout-objectives");
function setupTestObjectivesSnapPoints() {
    new ttpg_mock_1.MockGameObject({
        snapPoints: [
            new ttpg_mock_1.MockSnapPoint({
                tags: ["deck-objective-1", "deck-objective-2"],
            }),
        ],
    });
}
it("constructor", () => {
    setupTestObjectivesSnapPoints();
    const pos = new api_1.Vector(0, 0, 0);
    const yaw = 0;
    new layout_objectives_1.LayoutObjectives().getLayout().doLayoutAtPoint(pos, yaw);
});
it("getScoreboard", () => {
    new layout_objectives_1.LayoutObjectives().getScoreboard();
});
//# sourceMappingURL=layout-objectives.test.js.map