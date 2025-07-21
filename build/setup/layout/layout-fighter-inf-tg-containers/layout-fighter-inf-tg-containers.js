"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutFighterInfTgContainers = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const api_1 = require("@tabletop-playground/api");
const layout_fighter_containers_1 = require("./layout-fighter-containers");
const layout_infantry_containers_1 = require("./layout-infantry-containers");
const layout_tradegood_containers_1 = require("./layout-tradegood-containers");
class LayoutFighterInfTgContainers {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .setIsVertical(true);
        const topGarbage = ttpg_darrell_1.Spawn.spawnOrThrow("container:base/garbage");
        const bottompGarbage = ttpg_darrell_1.Spawn.spawnOrThrow("container:base/garbage");
        this._layout
            .add(topGarbage)
            .add(new layout_fighter_containers_1.LayoutFighterContainers().getLayout())
            .add(new layout_infantry_containers_1.LayoutInfantryContainers().getLayout())
            .add(new layout_tradegood_containers_1.LayoutTradegoodContainers().getLayout())
            .add(bottompGarbage);
        this._layout.addAfterLayout(() => {
            topGarbage.setObjectType(api_1.ObjectType.Ground);
            bottompGarbage.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutFighterInfTgContainers = LayoutFighterInfTgContainers;
//# sourceMappingURL=layout-fighter-inf-tg-containers.js.map