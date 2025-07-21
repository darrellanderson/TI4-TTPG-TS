"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutTableContainers = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const layout_system_container_1 = require("./layout-system-container");
const layout_exploration_container_1 = require("./layout-exploration-container");
const layout_frontier_container_1 = require("./layout-frontier-container");
/**
 * Misc containers.
 */
class LayoutTableContainers {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setIsVertical(true);
        const deletedItems = ttpg_darrell_1.Spawn.spawnOrThrow("container:base/deleted-items");
        const purgedItems = ttpg_darrell_1.Spawn.spawnOrThrow("container:base/purged");
        this._layout
            .add(new layout_frontier_container_1.LayoutFrontierContainer().getLayout())
            .add(new layout_system_container_1.LayoutSystemContainer().getLayout())
            .add(new layout_exploration_container_1.LayoutExplorationContainer().getLayout())
            .add(purgedItems)
            .add(deletedItems);
        this._layout.addAfterLayout(() => {
            deletedItems.setObjectType(api_1.ObjectType.Ground);
            purgedItems.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutTableContainers = LayoutTableContainers;
//# sourceMappingURL=layout-table-containers.js.map