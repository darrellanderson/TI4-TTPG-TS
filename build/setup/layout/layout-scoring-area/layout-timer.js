"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutTimer = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutTimer {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const timer = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/timer");
        this._layout.add(timer).addAfterLayout(() => {
            timer.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutTimer = LayoutTimer;
//# sourceMappingURL=layout-timer.js.map