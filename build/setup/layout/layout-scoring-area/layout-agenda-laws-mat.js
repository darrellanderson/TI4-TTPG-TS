"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutAgendaLawsMat = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
class LayoutAgendaLawsMat {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects().setChildDistance(layout_config_1.LayoutConfig.spacingWide);
        const mat = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/agenda-laws");
        const custodiansMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/custodians");
        this._layout
            .add(mat)
            .add(custodiansMat)
            .addAfterLayout(() => {
            mat.setObjectType(api_1.ObjectType.Ground);
            custodiansMat.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutAgendaLawsMat = LayoutAgendaLawsMat;
//# sourceMappingURL=layout-agenda-laws-mat.js.map