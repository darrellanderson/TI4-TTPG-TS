"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatUIPlanet = void 0;
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const button_ui_1 = require("../../button-ui/button-ui");
const config_1 = require("../../config/config");
const label_ui_1 = require("../../button-ui/label-ui");
const on_system_activated_1 = require("../../../event/on-system-activated/on-system-activated");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
const ttpg_darrell_1 = require("ttpg-darrell");
class CombatUIPlanet extends abtract_ui_1.AbstractUI {
    constructor(scale, planetIndex) {
        const planetNameUi = new label_ui_1.LabelUI(scale);
        const bombardmentUi = new button_ui_1.ButtonUI(scale);
        bombardmentUi.getButton().setText("Bombardment");
        bombardmentUi.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            TI4.events.onCombatClicked.trigger("bombardment", this._planetNameValue, player);
        }).get());
        const spaceCannonDefenseUi = new button_ui_1.ButtonUI(scale);
        spaceCannonDefenseUi.getButton().setText("Spc Cannon Defense");
        spaceCannonDefenseUi.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            TI4.events.onCombatClicked.trigger("spaceCannonDefense", this._planetNameValue, player);
        }).get());
        const groundCombatUi = new button_ui_1.ButtonUI(scale);
        groundCombatUi.getButton().setText("Ground Combat");
        groundCombatUi.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            TI4.events.onCombatClicked.trigger("groundCombat", this._planetNameValue, player);
        }).get());
        const abstractUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING)
            .addUIs([
            planetNameUi,
            bombardmentUi,
            spaceCannonDefenseUi,
            groundCombatUi,
        ])
            .build();
        super(abstractUi.getWidget(), abstractUi.getSize());
        this._planetNameValue = "-";
        this._onSystemActivatedHandler = () => {
            this.update();
        };
        this._planetIndex = planetIndex;
        this._planetName = planetNameUi.getText();
        this._bombardment = bombardmentUi.getButton();
        this._spaceCannonDefense = spaceCannonDefenseUi.getButton();
        this._groundCombat = groundCombatUi.getButton();
        TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
        this.update();
    }
    destroy() {
        this._bombardment.onClicked.clear();
        this._spaceCannonDefense.onClicked.clear();
        this._groundCombat.onClicked.clear();
        TI4.events.onSystemActivated.remove(this._onSystemActivatedHandler);
    }
    update() {
        this._planetNameValue = "-";
        let enabled = false;
        const system = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
        if (system) {
            const planet = system.getPlanets()[this._planetIndex];
            if (planet) {
                this._planetNameValue = planet.getName();
                enabled = true;
            }
        }
        this._planetName.setText(this._planetNameValue);
        this._bombardment.setEnabled(enabled);
        this._spaceCannonDefense.setEnabled(enabled);
        this._groundCombat.setEnabled(enabled);
    }
    getBombardment() {
        return this._bombardment;
    }
    getSpaceCannonDefense() {
        return this._spaceCannonDefense;
    }
    getGroundCombat() {
        return this._groundCombat;
    }
}
exports.CombatUIPlanet = CombatUIPlanet;
//# sourceMappingURL=combat-ui-planet.js.map