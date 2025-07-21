"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutFrontierContainer = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutFrontierContainer {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const container = ttpg_darrell_1.Spawn.spawnOrThrow("container.token:pok/frontier");
        container.setRotation([0, 0, 180]);
        this._layout.add(container).addAfterLayout(() => {
            container.setObjectType(api_1.ObjectType.Ground);
        });
        const tag = "frontier";
        let tags;
        if (container instanceof api_1.Container) {
            // Apply tag to restrict what can enter.
            tags = container.getContainerTags();
            if (!tags.includes(tag)) {
                tags.push(tag);
                container.setContainerTags(tags);
                container.setType(1);
            }
        }
        const tokenNsid = "token.attachment.system:pok/frontier";
        const token = ttpg_darrell_1.Spawn.spawnOrThrow(tokenNsid);
        tags = token.getTags();
        if (!tags.includes(tag)) {
            tags.push(tag);
            token.setTags(tags);
        }
        if (container instanceof api_1.Container) {
            container.insert([token]);
        }
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutFrontierContainer = LayoutFrontierContainer;
//# sourceMappingURL=layout-frontier-container.js.map