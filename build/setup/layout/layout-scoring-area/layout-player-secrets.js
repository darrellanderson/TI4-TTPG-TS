"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutPlayerSecrets = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const api_1 = require("@tabletop-playground/api");
class LayoutPlayerSecrets {
    constructor(playerCount) {
        const secrets1 = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacing);
        const secrets2 = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacing);
        const secretsArray = [];
        const topCount = Math.floor(playerCount / 2);
        for (let i = 0; i < playerCount; i++) {
            const secrets = ttpg_darrell_1.Spawn.spawnOrThrow("card-holder:base/player-scoring");
            secrets.setOwningPlayerSlot(10 + i);
            const whichLayout = i < topCount ? secrets1 : secrets2;
            whichLayout.add(secrets);
            secretsArray.push(secrets);
        }
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setIsVertical(true)
            .add(secrets1)
            .add(secrets2);
        this._layout.addAfterLayout(() => {
            secretsArray.forEach((secrets) => {
                secrets.setObjectType(api_1.ObjectType.Ground);
            });
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutPlayerSecrets = LayoutPlayerSecrets;
//# sourceMappingURL=layout-player-secrets.js.map