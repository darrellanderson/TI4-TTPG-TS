"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatUIAll = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const combat_ui_space_1 = require("../combat-ui-space/combat-ui-space");
const combat_ui_planet_1 = require("../combat-ui-planet/combat-ui-planet");
const combat_ui_hex_1 = require("../combat-ui-hex/combat-ui-hex");
const config_1 = require("../../config/config");
const horizontal_ui_builder_1 = require("../../panel/horizontal-ui-builder");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
/**
 * space | hex
 * planet| planet | planet
 */
class CombatUIAll extends abtract_ui_1.AbstractUI {
    constructor(scale, playerSlot) {
        const combatUiSpace = new combat_ui_space_1.CombatUISpace(scale, playerSlot);
        const combatUiPlanets = [];
        for (let i = 0; i < 3; i++) {
            combatUiPlanets.push(new combat_ui_planet_1.CombatUIPlanet(scale, i));
        }
        const combatUiHex = new combat_ui_hex_1.CombatUIHex(scale);
        const topRow = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING)
            .setVerticalAlignment(api_1.VerticalAlignment.Bottom)
            .addUIs([combatUiSpace, combatUiHex])
            .build();
        const bottomRow = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING)
            .addUIs(combatUiPlanets)
            .build();
        const abstractUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
            .addUIs([topRow, bottomRow])
            .build();
        super(abstractUi.getWidget(), abstractUi.getSize());
        this._combatUiPlanets = [];
        this._combatUiSpace = combatUiSpace;
        this._combatUiPlanets = combatUiPlanets;
        this._combatUiHex = combatUiHex;
    }
    destroy() {
        this._combatUiSpace.destroy();
        this._combatUiPlanets.forEach((combatUiPlanet) => {
            combatUiPlanet.destroy();
        });
        this._combatUiHex.destroy();
    }
}
exports.CombatUIAll = CombatUIAll;
//# sourceMappingURL=combat-ui-all.js.map