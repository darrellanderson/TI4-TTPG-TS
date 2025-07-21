"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutAll = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_combat_arena_and_unit_boxes_1 = require("../layout-combat-arena/layout-combat-arena-and-unit-boxes");
const layout_config_1 = require("../layout-config");
const layout_fighter_inf_tg_containers_1 = require("../layout-fighter-inf-tg-containers/layout-fighter-inf-tg-containers");
const layout_map_area_1 = require("../layout-map-area/layout-map-area");
const layout_player_area_1 = require("../layout-player-area/layout-player-area");
const layout_scoring_area_1 = require("../layout-scoring-area/layout-scoring-area");
const layout_strategy_cards_1 = require("../layout-strategy-cards/layout-strategy-cards");
const layout_table_containers_1 = require("../layout-table-containers/layout-table-containers");
const layout_table_decks_1 = require("../layout-table-decks/layout-table-decks");
const layout_table_system_tiles_1 = require("../layout-table-system-tiles/layout-table-system-tiles");
const layout_quick_roller_1 = require("../layout-quick-roller/layout-quick-roller");
const place_generic_home_systems_1 = require("../layout-map-area/place-generic-home-systems");
class LayoutAll {
    constructor(playerCount) {
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide)
            .setIsVertical(true);
        const top = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacingWide);
        const left = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide);
        const middle = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide);
        const right = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide);
        const bottom = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacingWide);
        this._layout.add(top).add(middle).add(bottom);
        const topCount = Math.floor(playerCount / 2);
        for (let i = 0; i < playerCount; i++) {
            const whichLayout = i < topCount ? top : bottom;
            whichLayout.add(new layout_player_area_1.LayoutPlayerArea(10 + i).getLayout());
        }
        left
            .add(new ttpg_darrell_1.LayoutObjects().setOverrideWidth(50)) // force left to be wider than right
            .add(new layout_table_containers_1.LayoutTableContainers().getLayout())
            .add(new layout_scoring_area_1.LayoutScoringArea(playerCount).getLayout())
            .add(new layout_table_decks_1.LayoutTableDecks().getLayout())
            .add(new layout_fighter_inf_tg_containers_1.LayoutFighterInfTgContainers().getLayout());
        right
            .add(new layout_fighter_inf_tg_containers_1.LayoutFighterInfTgContainers().getLayout())
            .add(new layout_combat_arena_and_unit_boxes_1.LayoutCombatArenaAndUnitBoxes().getLayout())
            .add(new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide)
            .setIsVertical(true)
            .add(new layout_strategy_cards_1.LayoutStrategyCards().getLayout())
            .add(new layout_quick_roller_1.LayoutQuickRoller().getLayout()));
        // Top player areas invert vertical layout.
        top.flip(false, true);
        // Add left, middle, right to the middle section.
        // Pad hack to center on "middle" area (assumes left is wider).
        const leftSize = left.calculateSize();
        const rightSize = right.calculateSize();
        const pad = leftSize.w - rightSize.w - layout_config_1.LayoutConfig.spacingExtraWide;
        right.add(new ttpg_darrell_1.LayoutObjects().setOverrideWidth(pad));
        const numMapRings = playerCount <= 6 ? 4 : 5; // always add an extra ring
        middle.add(left).add(new layout_map_area_1.LayoutMapArea(numMapRings).getLayout()).add(right);
        // Place system tiles.
        this._layout.addAfterLayout(() => {
            new layout_table_system_tiles_1.LayoutTableSystemTiles()
                .getLayout()
                .doLayoutAtPoint(this._layout.getCenter(), 0);
        });
        // Place generic home systems (AFTER setting up player areas).
        this._layout.addAfterLayout(() => {
            new place_generic_home_systems_1.PlaceGenericHomeSystems().placeOrThrow();
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutAll = LayoutAll;
//# sourceMappingURL=layout-all.js.map