"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyCardUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const button_ui_1 = require("../../button-ui/button-ui");
const config_1 = require("../../config/config");
const label_ui_1 = require("../../button-ui/label-ui");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
const zoomable_ui_1 = require("../../zoomable-ui/zoomable-ui");
const zoomed_strategy_card_ui_1 = require("./zoomed-strategy-card-ui");
const packageId = api_1.refPackageId;
/**
 * 2x wide, with an abstract body below the title.
 * [Play|Follow] [Pass]
 */
class StrategyCardUI extends abtract_ui_1.AbstractUI {
    constructor(scale, strategyCardsState, strategyCardBody, playerSlot) {
        const strategyCardNumber = strategyCardBody.getStrategyCardNumber();
        const body = strategyCardBody.getBody(scale);
        const name = strategyCardBody.getStrategyCardName();
        const titleUi = new label_ui_1.LabelUI(scale);
        titleUi
            .getText()
            .setFont("handel-gothic-regular.ttf", packageId)
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale * 1.1)
            .setJustification(api_1.TextJustification.Left)
            .setText(name.toUpperCase());
        const createZoomedStrategyCardUI = zoomed_strategy_card_ui_1.ZoomedStrategyCardUI.generateCreateZoomedUi(strategyCardNumber);
        const zoomableTitleUi = new zoomable_ui_1.ZoomableUI(titleUi, scale, createZoomedStrategyCardUI);
        const isPlay = strategyCardsState.getLastPlayerSlotPlayed(strategyCardNumber) ===
            playerSlot;
        const buttonPlayingPlayerFinished = new button_ui_1.ButtonUI(scale);
        buttonPlayingPlayerFinished.getButton().setText("Finished");
        const buttonFollow = new button_ui_1.ButtonUI(scale);
        buttonFollow.getButton().setText("Follow");
        const buttonPass = new button_ui_1.ButtonUI(scale);
        buttonPass.getButton().setText("Pass");
        const uis = [zoomableTitleUi];
        if (body) {
            uis.push(body);
        }
        if (isPlay) {
            uis.push(buttonPlayingPlayerFinished);
        }
        else {
            uis.push(buttonFollow, buttonPass);
        }
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(uis)
            .build();
        super(ui.getWidget(), ui.getSize());
        this._onPlayOrFollow = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerSlot = player.getSlot();
            const playerName = TI4.playerName.getBySlot(playerSlot);
            const parts = [
                `${playerName} ${this._isPlay ? "played" : "follows"} ${this._name}`,
            ];
            const report = this._strategyCardBody.getReport();
            if (report) {
                parts.push(report);
            }
            const msg = parts.join(" : ");
            const color = api_1.world.getSlotColor(playerSlot);
            ttpg_darrell_1.Broadcast.chatAll(msg, color);
            this._strategyCardsState.remove(this._playerSlot, this._strategyCardBody.getStrategyCardNumber());
        }).get();
        this._onPass = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerSlot = player.getSlot();
            const playerName = TI4.playerName.getBySlot(playerSlot);
            const msg = `${playerName} passes on ${this._name}`;
            const color = api_1.world.getSlotColor(playerSlot);
            ttpg_darrell_1.Broadcast.chatAll(msg, color);
            this._strategyCardsState.remove(this._playerSlot, this._strategyCardBody.getStrategyCardNumber());
        }).get();
        this._strategyCardsState = strategyCardsState;
        this._strategyCardBody = strategyCardBody;
        this._playerSlot = playerSlot;
        this._isPlay = isPlay;
        this._name = name;
        this._ui = ui;
        this._buttonPlayingPlayerFinished = buttonPlayingPlayerFinished.getButton();
        this._buttonFollow = buttonFollow.getButton();
        this._buttonPass = buttonPass.getButton();
        buttonPlayingPlayerFinished.getButton().onClicked.add(this._onPlayOrFollow);
        buttonFollow.getButton().onClicked.add(this._onPlayOrFollow);
        buttonPass.getButton().onClicked.add(this._onPass);
    }
    destroy() {
        this._ui.destroy();
    }
    getButtonPlayingPlayerFinished() {
        return this._buttonPlayingPlayerFinished;
    }
    getButtonFollow() {
        return this._buttonFollow;
    }
    getButtonPass() {
        return this._buttonPass;
    }
}
exports.StrategyCardUI = StrategyCardUI;
//# sourceMappingURL=strategy-card-ui.js.map