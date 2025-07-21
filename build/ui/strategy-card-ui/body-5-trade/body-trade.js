"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyTrade = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_strategy_card_body_1 = require("../abstract-strategy-card-body/abstract-strategy-card-body");
const checkbox_ui_1 = require("../../button-ui/checkbox-ui");
const config_1 = require("../../config/config");
const label_ui_1 = require("../../button-ui/label-ui");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
class BodyTrade extends abstract_strategy_card_body_1.AbstractStrategyCardBody {
    constructor(strategyCardsState, playerSlot) {
        super(strategyCardsState, 5, playerSlot);
        this._checkedSlots = new Set();
        const state = this.getState();
        if (state && state.length > 0) {
            const checkedSlotsArray = JSON.parse(state);
            for (const slot of checkedSlotsArray) {
                this._checkedSlots.add(slot);
            }
        }
    }
    getStrategyCardName() {
        return "Trade";
    }
    getBody(scale) {
        const enabled = this.isPlayingPlayer();
        if (!enabled) {
            return undefined;
        }
        const playingPlayerSlot = this.getPlayerSlot();
        const playingPlayerName = TI4.playerName.getBySlot(playingPlayerSlot);
        const playingPlayerColor = api_1.world.getSlotColor(playingPlayerSlot);
        const availableSlots = TI4.playerSeats
            .getAllSeats()
            .map((playerSeat) => playerSeat.playerSlot)
            .filter((slot) => slot !== this.getPlayerSlot());
        const uis = availableSlots.map((slot) => {
            const targetPlayerName = TI4.playerName.getBySlot(slot);
            const targetColor = api_1.world.getSlotColor(slot);
            const checkBoxUi = new checkbox_ui_1.CheckBoxUI(scale);
            checkBoxUi.getCheckBox().setIsChecked(this._checkedSlots.has(slot));
            checkBoxUi
                .getCheckBox()
                .setBold(true)
                .setText(" " + targetPlayerName)
                .setTextColor(targetColor);
            checkBoxUi
                .getCheckBox()
                .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
                if (isChecked) {
                    this._checkedSlots.add(slot);
                    const msg = `${playingPlayerName} refreshes ${targetPlayerName}.`;
                    ttpg_darrell_1.Broadcast.chatAll(msg, playingPlayerColor);
                }
                else {
                    this._checkedSlots.delete(slot);
                    const msg = `${playingPlayerName} un-refreshes ${targetPlayerName}.`;
                    ttpg_darrell_1.Broadcast.chatAll(msg, playingPlayerColor);
                }
                const json = JSON.stringify(Array.from(this._checkedSlots));
                this.setState(json);
            });
            return checkBoxUi;
        });
        const label = new label_ui_1.LabelUI(scale);
        label
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("Refresh players:");
        return new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(-config_1.CONFIG.SPACING * scale)
            .addUIs([label, ...uis])
            .build();
    }
    getReport() {
        return undefined;
    }
}
exports.BodyTrade = BodyTrade;
//# sourceMappingURL=body-trade.js.map