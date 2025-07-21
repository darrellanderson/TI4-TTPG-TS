"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutExplorationContainer = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutExplorationContainer {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const container = ttpg_darrell_1.Spawn.spawnOrThrow("container:pok/exploration");
        const tokenNsids = [
            "token.attachment.planet:codex.affinity/nanoforge",
            "token.attachment.planet:codex.vigil/custodia-vigilia",
            "token.attachment.planet:pok/biotic-research-facility",
            "token.attachment.planet:pok/cybernetic-research-facility",
            "token.attachment.planet:pok/demilitarized-zone",
            "token.attachment.planet:pok/dyson-sphere",
            "token.attachment.planet:pok/geoform",
            "token.attachment.planet:pok/lazax-survivors",
            "token.attachment.planet:pok/mining-world",
            "token.attachment.planet:pok/paradise-world",
            "token.attachment.planet:pok/propulsion-research-facility",
            "token.attachment.planet:pok/rich-world",
            "token.attachment.planet:pok/stellar-converter",
            "token.attachment.planet:pok/tomb-of-emphidia",
            "token.attachment.planet:pok/warfare-research-facility",
            "token.attachment.system:pok/ion-storm",
            "token.attachment.system:pok/mirage",
            "token.attachment.system:pok/wormhole-gamma",
            "token.attachment.system:pok/wormhole-gamma", // gamma-wormhole, gamma-relay cards
        ];
        const tag = "exploration";
        let tags;
        const tokens = tokenNsids.map((tokenNsid) => {
            const token = ttpg_darrell_1.Spawn.spawnOrThrow(tokenNsid);
            tags = token.getTags();
            if (!tags.includes(tag)) {
                tags.push(tag);
                token.setTags(tags);
            }
            return token;
        });
        if (container instanceof api_1.Container) {
            container.insert(tokens);
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
exports.LayoutExplorationContainer = LayoutExplorationContainer;
//# sourceMappingURL=layout-exploration-container.js.map