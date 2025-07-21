"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyLeadership = void 0;
const api_1 = require("@tabletop-playground/api");
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
const config_1 = require("../../config/config");
const label_ui_1 = require("../../button-ui/label-ui");
const slider_with_value_ui_1 = require("../../button-ui/slider-with-value-ui");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
class BodyLeadership extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 1, playerSlot);
        this._tokenCount = 0;
        this._onSliderChanged = (_slider, _player, value) => {
            this._tokenCount = value;
            this.setState(value.toString());
        };
        const state = this.getState();
        if (state && state.length > 0) {
            this._tokenCount = parseInt(state);
        }
        else if (this.isPlayingPlayer()) {
            this._tokenCount = 3;
        }
    }
    getStrategyCardName() {
        return "Leadership";
    }
    getBody(scale) {
        const numTokensLabel = new label_ui_1.LabelUI(scale);
        numTokensLabel
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("Gain tokens:");
        const numTokensSlider = new slider_with_value_ui_1.SliderWithValueUI(scale);
        numTokensSlider
            .getSlider()
            .setMinValue(0)
            .setMaxValue(16)
            .setValue(this._tokenCount);
        numTokensSlider.getSlider().onValueChanged.add(this._onSliderChanged);
        if (this.isPlayingPlayer()) {
            numTokensSlider.getSlider().setMinValue(3);
        }
        return new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([numTokensLabel, numTokensSlider])
            .build();
    }
    getReport() {
        return `gained ${this._tokenCount} tokens`;
    }
}
exports.BodyLeadership = BodyLeadership;
//# sourceMappingURL=body-leadership.js.map