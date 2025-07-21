"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutTroveMat = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
class LayoutTroveMat {
    constructor(playerSlot) {
        if (playerSlot < 0) {
            throw new Error("must have a player slot");
        }
        const troveMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.player:base/trove");
        troveMat.setOwningPlayerSlot(playerSlot);
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .add(troveMat);
        this._layout.addAfterLayout(() => {
            troveMat.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutTroveMat = LayoutTroveMat;
//# sourceMappingURL=layout-trove-mat.js.map