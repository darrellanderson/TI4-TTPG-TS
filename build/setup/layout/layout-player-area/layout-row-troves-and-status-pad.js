"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutRowTrovesAndStatusPad = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const layout_trove_mat_1 = require("./layout-trove-mat");
const layout_status_pad_1 = require("./layout-status-pad");
const api_1 = require("@tabletop-playground/api");
class LayoutRowTrovesAndStatusPad {
    constructor(playerSlot) {
        if (playerSlot < 0) {
            throw new Error("must have a player slot");
        }
        const trove1 = new layout_trove_mat_1.LayoutTroveMat(playerSlot).getLayout();
        const trove2 = new layout_trove_mat_1.LayoutTroveMat(playerSlot).getLayout();
        const statusPad = new layout_status_pad_1.LayoutStatusPad(playerSlot).getLayout();
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .setIsVertical(false)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .add(trove1)
            .add(statusPad)
            .add(trove2);
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutRowTrovesAndStatusPad = LayoutRowTrovesAndStatusPad;
//# sourceMappingURL=layout-row-troves-and-status-pad.js.map