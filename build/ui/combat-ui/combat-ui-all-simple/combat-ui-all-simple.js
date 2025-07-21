"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatUIAllSimple = void 0;
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const combat_ui_space_1 = require("../combat-ui-space/combat-ui-space");
const combat_ui_planet_1 = require("../combat-ui-planet/combat-ui-planet");
const config_1 = require("../../config/config");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
/**
 * Clean combat UI, minimal.
 */
class CombatUIAllSimple extends abtract_ui_1.AbstractUI {
    constructor(scale, playerSlot) {
        const combatUiSpace = new combat_ui_space_1.CombatUISpace(scale, playerSlot);
        const combatUiPlanets = [];
        for (let i = 0; i < 3; i++) {
            combatUiPlanets.push(new combat_ui_planet_1.CombatUIPlanet(scale, i));
        }
        const abstractUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING)
            .addUIs([combatUiSpace, ...combatUiPlanets])
            .build();
        super(abstractUi.getWidget(), abstractUi.getSize());
        this._combatUiPlanets = [];
        this._combatUiSpace = combatUiSpace;
        this._combatUiPlanets = combatUiPlanets;
    }
    destroy() {
        this._combatUiSpace.destroy();
        this._combatUiPlanets.forEach((combatUiPlanet) => {
            combatUiPlanet.destroy();
        });
    }
}
exports.CombatUIAllSimple = CombatUIAllSimple;
//# sourceMappingURL=combat-ui-all-simple.js.map