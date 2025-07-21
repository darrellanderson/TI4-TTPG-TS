"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyCardsUI = void 0;
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
const div_ui_1 = require("../../div-ui/div-ui");
const label_ui_1 = require("../../button-ui/label-ui");
const strategy_card_ui_1 = require("../strategy-card-ui/strategy-card-ui");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
const body_leadership_1 = require("../body-1-leadership/body-leadership");
const body_diplomacy_1 = require("../body-2-diplomacy/body-diplomacy");
const body_politics_1 = require("../body-3-politics/body-politics");
const body_construction_1 = require("../body-4-construction/body-construction");
const body_trade_1 = require("../body-5-trade/body-trade");
const body_warfare_1 = require("../body-6-warfare/body-warfare");
const body_technology_1 = require("../body-7-technology/body-technology");
const body_imperial_1 = require("../body-8-imperial/body-imperial");
/**
 * UI with all active strategy cards.
 */
class StrategyCardsUI extends abtract_ui_1.AbstractUI {
    constructor(scale, strategyCardsState, playerSlot) {
        const uis = [];
        const numbersAndStates = strategyCardsState.active(playerSlot);
        numbersAndStates.forEach((numberAndState, index) => {
            if (index > 0) {
                const scaledLength = config_1.CONFIG.BUTTON_WIDTH * scale;
                const div = new div_ui_1.DivUI(scale, scaledLength, "horizontal");
                uis.push(div);
            }
            const strategyCardNumber = numberAndState.number;
            let body = undefined;
            if (strategyCardNumber === 1) {
                body = new body_leadership_1.BodyLeadership(strategyCardsState, playerSlot);
            }
            else if (strategyCardNumber === 2) {
                body = new body_diplomacy_1.BodyDiplomacy(strategyCardsState, playerSlot);
            }
            else if (strategyCardNumber === 3) {
                body = new body_politics_1.BodyPolitics(strategyCardsState, playerSlot);
            }
            else if (strategyCardNumber === 4) {
                body = new body_construction_1.BodyConstruction(strategyCardsState, playerSlot);
            }
            else if (strategyCardNumber === 5) {
                body = new body_trade_1.BodyTrade(strategyCardsState, playerSlot);
            }
            else if (strategyCardNumber === 6) {
                body = new body_warfare_1.BodyWarfare(strategyCardsState, playerSlot);
            }
            else if (strategyCardNumber === 7) {
                body = new body_technology_1.BodyTechnology(strategyCardsState, playerSlot);
            }
            else if (strategyCardNumber === 8) {
                body = new body_imperial_1.BodyImperial(strategyCardsState, playerSlot);
            }
            if (body) {
                const ui = new strategy_card_ui_1.StrategyCardUI(scale, strategyCardsState, body, playerSlot);
                uis.push(ui);
            }
        });
        if (uis.length === 0) {
            const empty = new label_ui_1.LabelUI(scale);
            empty.getText().setText("No Strategy Cards");
            uis.push(empty);
        }
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(uis)
            .build();
        super(ui.getWidget(), ui.getSize());
        this._ui = ui;
    }
    destroy() {
        this._ui.destroy();
    }
}
exports.StrategyCardsUI = StrategyCardsUI;
//# sourceMappingURL=strategy-cards-ui.js.map