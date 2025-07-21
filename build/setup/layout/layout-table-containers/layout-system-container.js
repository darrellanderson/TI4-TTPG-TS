"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutSystemContainer = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutSystemContainer {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const systemTiles = [];
        const tag = "system";
        let tags;
        const tileNumbers = TI4.systemRegistry.getAllSystemTileNumbers();
        for (const tileNumber of tileNumbers) {
            const systemSchema = TI4.systemRegistry.rawBySystemTileNumber(tileNumber);
            const nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
            if (systemSchema && !systemSchema.isHome && nsid) {
                const systemTile = ttpg_darrell_1.Spawn.spawnOrThrow(nsid);
                systemTiles.push(systemTile);
                tags = systemTile.getTags();
                if (!tags.includes(tag)) {
                    tags.push(tag);
                    systemTile.setTags(tags);
                }
            }
        }
        const container = ttpg_darrell_1.Spawn.spawnOrThrow("container:base/systems");
        if (container instanceof api_1.Container) {
            container.setMaxItems(500);
            container.insert(systemTiles);
            // Apply tag to restrict what can enter.
            tags = container.getContainerTags();
            if (!tags.includes(tag)) {
                tags.push(tag);
                container.setContainerTags(tags);
            }
        }
        this._layout.add(container).addAfterLayout(() => {
            container.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutSystemContainer = LayoutSystemContainer;
//# sourceMappingURL=layout-system-container.js.map