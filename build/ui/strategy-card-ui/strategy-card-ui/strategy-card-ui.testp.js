"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
const label_ui_1 = require("../../button-ui/label-ui");
const strategy_card_ui_1 = require("./strategy-card-ui");
const strategy_cards_state_1 = require("../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state");
class MyAbstractStrategyCardBody extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 1, playerSlot);
    }
    getStrategyCardName() {
        return "test";
    }
    getStrategyCardNumber() {
        return 1;
    }
    getBody(scale) {
        const ui = new label_ui_1.LabelUI(scale);
        ui.getText().setText("test body");
        return ui;
    }
    getReport() {
        return "my report";
    }
}
function go() {
    const scale = 1;
    const playerSlot = 10;
    const strategyCardsState = new strategy_cards_state_1.StrategyCardsState("@test-strat-card/test");
    const strategyCardBody = new MyAbstractStrategyCardBody(strategyCardsState, playerSlot);
    const abstractUi = new strategy_card_ui_1.StrategyCardUI(scale, strategyCardsState, strategyCardBody, playerSlot);
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = abstractUi.getSize().w + 2;
    screenUI.height = abstractUi.getSize().h + 2;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(abstractUi.getWidget());
    api_1.world.addScreenUI(screenUI);
}
function goWrapper() {
    try {
        go();
    }
    catch (e) {
        console.error("Error in goWrapper:", e);
    }
}
setTimeout(goWrapper, 100);
//# sourceMappingURL=strategy-card-ui.testp.js.map