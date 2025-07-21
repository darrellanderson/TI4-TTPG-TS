"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutQuickRoller = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutQuickRoller {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const quickRoller = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/quick-roller");
        this._layout.add(quickRoller).addAfterLayout(() => {
            quickRoller.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutQuickRoller = LayoutQuickRoller;
//# sourceMappingURL=layout-quick-roller.js.map