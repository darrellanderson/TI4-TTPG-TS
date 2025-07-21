"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutInfantryContainers = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const api_1 = require("@tabletop-playground/api");
class LayoutInfantryContainers {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setIsVertical(false);
        const nsidNames = ["infantry-1", "infantry-3"];
        const containers = [];
        nsidNames.forEach((nsidName) => {
            const tokenNsid = `token:base/${nsidName}`;
            const containerNsid = `container.${tokenNsid}`;
            const token = ttpg_darrell_1.Spawn.spawnOrThrow(tokenNsid);
            let tags = token.getTags();
            tags.push(nsidName);
            token.setTags(tags);
            const container = ttpg_darrell_1.Spawn.spawnOrThrow(containerNsid);
            containers.push(container);
            if (container instanceof api_1.Container) {
                container.setType(1); // infinite
                container.insert([token]);
                tags = container.getContainerTags();
                tags.push(nsidName);
                container.setContainerTags(tags);
            }
            container.setRotation([0, 0, 180]);
            this._layout.add(container);
        });
        this._layout.addAfterLayout(() => {
            containers.forEach((container) => {
                container.setObjectType(api_1.ObjectType.Ground);
            });
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutInfantryContainers = LayoutInfantryContainers;
//# sourceMappingURL=layout-infantry-containers.js.map