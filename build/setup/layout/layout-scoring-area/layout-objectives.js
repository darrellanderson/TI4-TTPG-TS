"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutObjectives = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const layout_table_decks_1 = require("../layout-table-decks/layout-table-decks");
class LayoutObjectives {
    constructor() {
        const objectivesMat1 = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/objective-1");
        this._scoreboard = ttpg_darrell_1.Spawn.spawnOrThrow("token:base/scoreboard");
        const objectivesMat2 = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/objective-2");
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setIsVertical(true)
            .add(objectivesMat1)
            .add(this._scoreboard)
            .add(objectivesMat2);
        this._layout.addAfterLayout(() => {
            objectivesMat1.setObjectType(api_1.ObjectType.Ground);
            this._scoreboard.setObjectType(api_1.ObjectType.Ground);
            objectivesMat2.setObjectType(api_1.ObjectType.Ground);
        });
        this._layout.addAfterLayout(() => {
            layout_table_decks_1.LayoutTableDecks._spawnDeck("card.objective.public-1", "deck-objective-1");
            layout_table_decks_1.LayoutTableDecks._spawnDeck("card.objective.public-2", "deck-objective-2");
        });
    }
    getLayout() {
        return this._layout;
    }
    getScoreboard() {
        return this._scoreboard;
    }
}
exports.LayoutObjectives = LayoutObjectives;
//# sourceMappingURL=layout-objectives.js.map