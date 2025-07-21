"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutPlayerAreas = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_player_area_1 = require("./layout-player-area");
const layout_config_1 = require("../layout-config");
class LayoutPlayerAreas {
    constructor(playerCount) {
        const top = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide)
            .setIsVertical(false)
            .setVerticalAlignment(api_1.VerticalAlignment.Bottom);
        const middle = new ttpg_darrell_1.LayoutObjects().setOverrideHeight(0);
        const bottom = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide)
            .setIsVertical(false)
            .setVerticalAlignment(api_1.VerticalAlignment.Bottom);
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide)
            .setIsVertical(true)
            .add(top)
            .add(middle)
            .add(bottom);
        const topCount = Math.floor(playerCount / 2);
        for (let i = 0; i < playerCount; i++) {
            const whichLayout = i < topCount ? top : bottom;
            whichLayout.add(new layout_player_area_1.LayoutPlayerArea(10 + i).getLayout());
        }
        top.flip(false, true);
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutPlayerAreas = LayoutPlayerAreas;
//# sourceMappingURL=layout-player-areas.js.map