"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutStatusPad = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutStatusPad {
    constructor(playerSlot) {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const statusPad = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/status-pad");
        statusPad.setOwningPlayerSlot(playerSlot);
        const colorLib = new ttpg_darrell_1.ColorLib();
        const colorsType = colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
        const color = colorLib.parseColorOrThrow(colorsType.plastic);
        statusPad.setPrimaryColor(color);
        this._layout.add(statusPad).addAfterLayout(() => {
            statusPad.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutStatusPad = LayoutStatusPad;
//# sourceMappingURL=layout-status-pad.js.map