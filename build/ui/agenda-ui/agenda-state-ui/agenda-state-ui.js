"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaStateUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const agenda_available_votes_ui_1 = require("../agenda-available-votes-ui/agenda-available-votes-ui");
const agenda_card_ui_1 = require("../agenda-card-ui/agenda-card-ui");
const agenda_how_to_ui_1 = require("../agenda-how-to-ui/agenda-how-to-ui");
const agenda_outcome_ui_1 = require("../agenda-outcome-ui/agenda-outcome-ui");
const agenda_vote_count_ui_1 = require("../agenda-vote-count-ui/agenda-vote-count-ui");
const button_ui_1 = require("../../button-ui/button-ui");
const config_1 = require("../../config/config");
const horizontal_ui_builder_1 = require("../../panel/horizontal-ui-builder");
const label_ui_1 = require("../../button-ui/label-ui");
const long_label_ui_1 = require("../../button-ui/long-label-ui");
const switcher_ui_1 = require("../../../ui/switcher-ui/switcher-ui");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
const agenda_choose_type_ui_1 = require("../agenda-choose-type-ui/agenda-choose-type-ui");
/**
 * [waiting for: ...]
 * [Available votes:] [Available votes]x3 [reset votes]
 * [1. My whens:] [play when] [no whens for now] [never whens] [reset whens]
 * [2. My afters:] [play after] [no afters for now] [never afters] [reset afters]
 * [Voting: choose outcome and set your votes for it below]
 * [...Outcome] [vote summary]+[]
 * [3. My votes:] [# + -] [lock votes] [reset votes]
 */
class AgendaStateUI extends abtract_ui_1.AbstractUI {
    static _createAgendaCardUI(agendaState, scale) {
        const objId = agendaState.getAgendaObjId();
        const agendaCard = api_1.world.getObjectById(objId);
        if (!agendaCard || !(agendaCard instanceof api_1.Card)) {
            throw new Error("Agenda card missing or not card");
        }
        if (!agendaCard.isFaceUp()) {
            return new agenda_card_ui_1.AgendaCardFaceDownUI(scale);
        }
        return new agenda_card_ui_1.AgendaCardUI(agendaCard, scale);
    }
    static _createWaitingForRow(agendaState, scale) {
        const label = new label_ui_1.LabelUI(scale);
        label
            .getText()
            .setJustification(api_1.TextJustification.Right)
            .setText("Waiting for:");
        // Room for 4, but use 3 to center in the space.
        const scaledWidth = config_1.CONFIG.BUTTON_WIDTH * scale * 3 + config_1.CONFIG.SPACING * 2;
        const longLabel = new long_label_ui_1.LongLabelUI(scaledWidth, scale);
        const text = longLabel.getText();
        agendaState.onAgendaStateChanged.add(() => {
            const msg = agendaState.getWaitingForMessage();
            text.setText(msg);
        });
        return new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([label, longLabel])
            .build();
    }
    static _createAvailableVotesRow(scale) {
        const label = new label_ui_1.LabelUI(scale);
        label
            .getText()
            .setJustification(api_1.TextJustification.Right)
            .setText("Available votes:");
        const availableVotesUI = new agenda_available_votes_ui_1.AgendaAvailableVotesUI(config_1.CONFIG.BUTTON_WIDTH * scale * 3 + config_1.CONFIG.SPACING * 2, scale);
        const reset = new button_ui_1.ButtonUI(scale);
        reset.getButton().setText("Reset available votes");
        reset.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(() => {
            availableVotesUI.update();
        }).get());
        return new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([label, availableVotesUI, reset])
            .build();
    }
    static _createWhensRow(agendaState, seatIndex, scale) {
        const label = new label_ui_1.LabelUI(scale);
        label
            .getText()
            .setJustification(api_1.TextJustification.Right)
            .setText("My whens:");
        const playWhen = new button_ui_1.ButtonUI(scale);
        playWhen.getButton().setText("Play when");
        playWhen.getButton().onClicked.add(() => {
            agendaState.setSeatNoWhens(seatIndex, "play");
        });
        const noWhens = new button_ui_1.ButtonUI(scale);
        noWhens.getButton().setText("No whens (for now)");
        noWhens.getButton().onClicked.add(() => {
            agendaState.setSeatNoWhens(seatIndex, "no");
        });
        const neverWhens = new button_ui_1.ButtonUI(scale);
        neverWhens.getButton().setText("Never whens");
        neverWhens.getButton().onClicked.add(() => {
            agendaState.setSeatNoWhens(seatIndex, "never");
        });
        const reset = new button_ui_1.ButtonUI(scale);
        reset.getButton().setText("Reset whens");
        reset.getButton().onClicked.add(() => {
            agendaState.setSeatNoWhens(seatIndex, "unknown");
        });
        agendaState.onAgendaStateChanged.add(() => {
            const noNeverUnknownPlay = agendaState.getSeatNoWhens(seatIndex);
            noWhens.getButton().setEnabled(noNeverUnknownPlay === "unknown");
            neverWhens.getButton().setEnabled(noNeverUnknownPlay !== "never");
            playWhen.getButton().setEnabled(noNeverUnknownPlay === "unknown");
        });
        return new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([label, playWhen, noWhens, neverWhens, reset])
            .build();
    }
    static _createAftersRow(agendaState, seatIndex, scale) {
        const label = new label_ui_1.LabelUI(scale);
        label
            .getText()
            .setJustification(api_1.TextJustification.Right)
            .setText("My afters:");
        const playAfter = new button_ui_1.ButtonUI(scale);
        playAfter.getButton().setText("Play after");
        playAfter.getButton().onClicked.add(() => {
            agendaState.setSeatNoAfters(seatIndex, "play");
        });
        const noAfters = new button_ui_1.ButtonUI(scale);
        noAfters.getButton().setText("No afters (for now)");
        noAfters.getButton().onClicked.add(() => {
            agendaState.setSeatNoAfters(seatIndex, "no");
        });
        const neverAfters = new button_ui_1.ButtonUI(scale);
        neverAfters.getButton().setText("Never afters");
        neverAfters.getButton().onClicked.add(() => {
            agendaState.setSeatNoAfters(seatIndex, "never");
        });
        const reset = new button_ui_1.ButtonUI(scale);
        reset.getButton().setText("Reset afters");
        reset.getButton().onClicked.add(() => {
            agendaState.setSeatNoAfters(seatIndex, "unknown");
        });
        agendaState.onAgendaStateChanged.add(() => {
            const noNeverUnknownPlay = agendaState.getSeatNoAfters(seatIndex);
            noAfters.getButton().setEnabled(noNeverUnknownPlay === "unknown");
            neverAfters.getButton().setEnabled(noNeverUnknownPlay !== "never");
            playAfter.getButton().setEnabled(noNeverUnknownPlay === "unknown");
        });
        return new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([label, playAfter, noAfters, neverAfters, reset])
            .build();
    }
    /**
     * Votes: [not voting|#] [lock votes]
     *
     * @param agendaState
     * @param seatIndex
     * @param scale
     * @returns
     */
    static _createHowToVoteRow(agendaState, seatIndex, scale) {
        const label = new label_ui_1.LabelUI(scale);
        label
            .getText()
            .setJustification(api_1.TextJustification.Right)
            .setText("My votes:");
        const votes = new agenda_vote_count_ui_1.AgendaVoteCountUI(agendaState, seatIndex, scale);
        const scaledWidth = config_1.CONFIG.BUTTON_WIDTH * scale * 3 + config_1.CONFIG.SPACING * 2 * scale;
        const howTo = new long_label_ui_1.LongLabelUI(scaledWidth, scale);
        howTo
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("select outcome below, enter votes and lock; to abstain lock zero votes");
        return new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([label, votes, howTo])
            .build();
    }
    static _createOutcomeUIs(agendaState, scale) {
        const outcomeUIs = [];
        for (let i = 0; i < 8; i++) {
            const outcomeUI = new agenda_outcome_ui_1.AgendaOutcomeUI(agendaState, i, scale);
            outcomeUIs.push(outcomeUI);
        }
        agendaState.onAgendaStateChanged.add(() => {
            const numOutcomes = agendaState.getNumOutcomes();
            outcomeUIs.forEach((outcomeUI, index) => {
                outcomeUI.getWidget().setVisible(index < numOutcomes);
            });
        });
        return new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(outcomeUIs)
            .build();
    }
    static _createTopLeftUI(agendaState, seatIndex, scale) {
        const availableVotesUI = AgendaStateUI._createAvailableVotesRow(scale);
        const howToUI = new agenda_how_to_ui_1.AgendaHowToUI(scale);
        const waitingForUI = AgendaStateUI._createWaitingForRow(agendaState, scale);
        const whensUI = AgendaStateUI._createWhensRow(agendaState, seatIndex, scale);
        const aftersUI = AgendaStateUI._createAftersRow(agendaState, seatIndex, scale);
        const votingUI = AgendaStateUI._createHowToVoteRow(agendaState, seatIndex, scale);
        return new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([
            howToUI,
            waitingForUI,
            availableVotesUI,
            whensUI,
            aftersUI,
            votingUI,
        ])
            .build();
    }
    static _createTopRightUI(agendaState, scale) {
        const agendaCardUI = AgendaStateUI._createAgendaCardUI(agendaState, scale);
        return agendaCardUI;
    }
    static _createBottomUI(agendaState, scale) {
        const outcomesUI = AgendaStateUI._createOutcomeUIs(agendaState, scale);
        return outcomesUI;
    }
    constructor(agendaState, seatIndex, scale) {
        const topRowLeftUI = AgendaStateUI._createTopLeftUI(agendaState, seatIndex, scale);
        const topRightUI = AgendaStateUI._createTopRightUI(agendaState, scale);
        const bottomUI = AgendaStateUI._createBottomUI(agendaState, scale);
        const outcomeTypeUi = new agenda_choose_type_ui_1.AgendaChooseTypeUI(agendaState, scale);
        const switcherUi = new switcher_ui_1.SwitcherUI([outcomeTypeUi, bottomUI]);
        const topUI = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([topRowLeftUI, topRightUI])
            .build();
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([topUI, switcherUi])
            .build();
        super(ui.getWidget(), ui.getSize());
        this._agendaState = agendaState;
        this._switcherUiOutcomeTypeThenMain = switcherUi;
        // Switch to the main UI when outcome type is known.
        agendaState.onAgendaStateChanged.add(() => {
            if (agendaState.getNumOutcomes() > 0) {
                this._switcherUiOutcomeTypeThenMain.switchToIndex(1);
            }
        });
        // Trigger the event to update the UI.
        this._agendaState.onAgendaStateChanged.trigger(agendaState);
    }
    destroy() {
        super.destroy();
    }
}
exports.AgendaStateUI = AgendaStateUI;
//# sourceMappingURL=agenda-state-ui.js.map