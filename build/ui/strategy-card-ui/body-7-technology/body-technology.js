"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyTechnology = void 0;
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
const button_ui_1 = require("../../button-ui/button-ui");
const ttpg_darrell_1 = require("ttpg-darrell");
class BodyTechnology extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 7, playerSlot);
        this._onChooseTechButtonClicked = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerSlot = player.getSlot();
            TI4.events.onTechChooserRequest.trigger(playerSlot);
        }).get();
    }
    getStrategyCardName() {
        return "Technology";
    }
    getBody(scale) {
        const chooseButton = new button_ui_1.ButtonUI(scale);
        chooseButton.getButton().setText("Choose technology...");
        chooseButton.getButton().onClicked.add(this._onChooseTechButtonClicked);
        return chooseButton;
    }
    getReport() {
        return undefined;
    }
}
exports.BodyTechnology = BodyTechnology;
//# sourceMappingURL=body-technology.js.map