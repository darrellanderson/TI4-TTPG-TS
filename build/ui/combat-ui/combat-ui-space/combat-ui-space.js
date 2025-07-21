"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatUISpace = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const button_ui_1 = require("../../button-ui/button-ui");
const config_1 = require("../../config/config");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
class CombatUISpace extends abtract_ui_1.AbstractUI {
    constructor(scale, playerSlot) {
        const planetName = undefined; // space
        const spaceCannonOffenseUi = new button_ui_1.ButtonUI(scale);
        spaceCannonOffenseUi.getButton().setText("Spc Cannon Offense");
        spaceCannonOffenseUi.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            TI4.events.onCombatClicked.trigger("spaceCannonOffense", planetName, player);
        }).get());
        const ambushUi = new button_ui_1.ButtonUI(scale);
        ambushUi.getButton().setText("Ambush");
        ambushUi.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            TI4.events.onCombatClicked.trigger("ambush", planetName, player);
        }).get());
        const antifighterBarrageUi = new button_ui_1.ButtonUI(scale);
        antifighterBarrageUi.getButton().setText("Anti-fighter Barrage");
        antifighterBarrageUi.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            TI4.events.onCombatClicked.trigger("antiFighterBarrage", planetName, player);
        }).get());
        const spaceCombatUi = new button_ui_1.ButtonUI(scale);
        spaceCombatUi.getButton().setText("Space Combat");
        spaceCombatUi.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            TI4.events.onCombatClicked.trigger("spaceCombat", planetName, player);
        }).get());
        const uis = [
            spaceCannonOffenseUi,
            ambushUi,
            antifighterBarrageUi,
            spaceCombatUi,
        ];
        const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
        if (!faction ||
            !faction.getAbilityNsids().includes("faction-ability:base/ambush")) {
            uis.splice(1, 1); // prune ambush
        }
        const abstractUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING)
            .addUIs(uis)
            .build();
        super(abstractUi.getWidget(), abstractUi.getSize());
        this._spaceCannonOffense = spaceCannonOffenseUi.getButton();
        this._ambush = ambushUi.getButton();
        this._antifighterBarrage = antifighterBarrageUi.getButton();
        this._spaceCombat = spaceCombatUi.getButton();
    }
    destroy() {
        this._spaceCannonOffense.onClicked.clear();
        this._ambush.onClicked.clear();
        this._antifighterBarrage.onClicked.clear();
        this._spaceCombat.onClicked.clear();
    }
    getSpaceCannonOffense() {
        return this._spaceCannonOffense;
    }
    getAmbush() {
        return this._ambush;
    }
    getAntifighterBarrage() {
        return this._antifighterBarrage;
    }
    getSpaceCombat() {
        return this._spaceCombat;
    }
}
exports.CombatUISpace = CombatUISpace;
//# sourceMappingURL=combat-ui-space.js.map