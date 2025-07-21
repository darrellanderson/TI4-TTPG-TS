"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaVoteCountUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * ONE player's vote entry.
 *
 * #editable [lock]
 */
class AgendaVoteCountUI extends abtract_ui_1.AbstractUI {
    constructor(agendaState, seatIndex, scale) {
        const votesTextBox = new api_1.TextBox()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setMaxLength(3)
            .setInputType(4); // positive integers (or zero)
        const decrButton = new api_1.Button()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setText("-");
        const incrButton = new api_1.Button()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setText("+");
        const lockButton = new api_1.Button().setFontSize(config_1.CONFIG.FONT_SIZE * scale);
        const panel = new api_1.HorizontalBox()
            .setChildDistance(config_1.CONFIG.SPACING * scale)
            .addChild(votesTextBox, 0.3)
            .addChild(decrButton, 0.15)
            .addChild(incrButton, 0.15)
            .addChild(lockButton, 0.4);
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const widget = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(panel);
        agendaState.onAgendaStateChanged.add(() => {
            const votes = agendaState.getSeatVotesForOutcome(seatIndex);
            const locked = agendaState.getSeatVotesLocked(seatIndex);
            votesTextBox.setText(votes.toString());
            votesTextBox.setEnabled(!locked);
            decrButton.setEnabled(!locked);
            incrButton.setEnabled(!locked);
            lockButton.setText(locked ? "Unlock" : "Lock");
        });
        super(widget, size);
        this._onLockClicked = new ttpg_darrell_1.ThrottleClickHandler(() => {
            const oldLocked = this._agendaState.getSeatVotesLocked(this._seatIndex);
            const newLocked = !oldLocked;
            this._agendaState.setSeatVotesLocked(this._seatIndex, newLocked);
        }).get();
        this._applyVoteCountToAgendaState = () => {
            this._delayedApplyVotesHandle = undefined;
            const votes = parseInt(this._votesTextBox.getText(), 10);
            this._agendaState.setSeatVotesForOutcome(this._seatIndex, votes);
        };
        this._onVotesChanged = () => {
            if (this._delayedApplyVotesHandle) {
                clearTimeout(this._delayedApplyVotesHandle);
                this._delayedApplyVotesHandle = undefined;
            }
            this._delayedApplyVotesHandle = setTimeout(this._applyVoteCountToAgendaState, 500);
        };
        this._incr = new ttpg_darrell_1.ThrottleClickHandler(() => {
            let votes = this._agendaState.getSeatVotesForOutcome(this._seatIndex);
            votes = Math.min(999, votes + 1);
            this._agendaState.setSeatVotesForOutcome(this._seatIndex, votes);
        }).get();
        this._decr = new ttpg_darrell_1.ThrottleClickHandler(() => {
            let votes = this._agendaState.getSeatVotesForOutcome(this._seatIndex);
            votes = Math.max(0, votes - 1);
            this._agendaState.setSeatVotesForOutcome(this._seatIndex, votes);
        }).get();
        decrButton.onClicked.add(this._decr);
        incrButton.onClicked.add(this._incr);
        lockButton.onClicked.add(this._onLockClicked);
        votesTextBox.onTextCommitted.add(this._onVotesChanged);
        this._agendaState = agendaState;
        this._seatIndex = seatIndex;
        this._votesTextBox = votesTextBox;
        this._lockButton = lockButton;
    }
    destroy() {
        if (this._delayedApplyVotesHandle) {
            clearTimeout(this._delayedApplyVotesHandle);
            this._delayedApplyVotesHandle = undefined;
        }
        super.destroy();
    }
}
exports.AgendaVoteCountUI = AgendaVoteCountUI;
//# sourceMappingURL=agenda-vote-count-ui.js.map