"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaOutcomeUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
const editable_button_ui_1 = require("../../button-ui/editable-button-ui");
const horizontal_ui_builder_1 = require("../../panel/horizontal-ui-builder");
const long_richtext_ui_1 = require("../../button-ui/long-richtext-ui");
const ttpg_darrell_1 = require("ttpg-darrell");
const agenda_rider_ui_1 = require("./agenda-rider-ui");
/**
 * UI:
 * - Outcome name (Text and EditText in a WidgetSwitcher).
 * - Total votes (Text).
 * - Per-player votes (Text).
 * - Riders (Button, show zoomed rider on click).
 */
class AgendaOutcomeUI extends abtract_ui_1.AbstractUI {
    constructor(agendaState, outcomeIndex, scale) {
        const voteSummary = new long_richtext_ui_1.LongRichTextUI(config_1.CONFIG.BUTTON_WIDTH * scale, scale);
        voteSummary.getRichText().setJustification(api_1.TextJustification.Right);
        const outcomeNameUi = new editable_button_ui_1.EditableButtonUI(scale);
        const riders = new agenda_rider_ui_1.AgendaRiderUI(agendaState, outcomeIndex, scale);
        const ui = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([voteSummary, outcomeNameUi, riders])
            .build();
        super(ui.getWidget(), ui.getSize());
        this._onOutcomeClicked = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerSlot = player.getSlot();
            const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
            this._agendaState.setSeatOutcomeChoice(seatIndex, this._outcomeIndex);
            // If the player has cast zero votes, set votes to 1 so that the
            // chosen outcome is visible (must have a vote to display).
            if (this._agendaState.getSeatVotesForOutcome(seatIndex) === 0) {
                this._agendaState.setSeatVotesForOutcome(seatIndex, 1);
            }
        }).get();
        this._agendaState = agendaState;
        this._outcomeIndex = outcomeIndex;
        this._onEdited = (text) => {
            agendaState.setOutcomeName(outcomeIndex, text);
        };
        outcomeNameUi.getButton().onClicked.add(this._onOutcomeClicked);
        outcomeNameUi.onEdited.add(this._onEdited);
        // Temporary workaround for rich text: need to set size for bold/etc elements.
        const fontSize = Math.round(config_1.CONFIG.FONT_SIZE * scale);
        agendaState.onAgendaStateChanged.add(() => {
            var _a;
            // Outcome name.
            const outcomeName = (_a = agendaState.getOutcomeName(outcomeIndex)) !== null && _a !== void 0 ? _a : "";
            outcomeNameUi.getButton().setText(outcomeName);
            // Vote summary.
            const richVotes = [];
            let totalVotes = 0;
            TI4.playerSeats.getAllSeats().forEach((seat, index) => {
                const outcomeChoice = agendaState.getSeatOutcomeChoice(index);
                const votes = agendaState.getSeatVotesForOutcome(index);
                if (outcomeChoice === outcomeIndex && votes > 0) {
                    const playerSlot = seat.playerSlot;
                    const color = api_1.world.getSlotColor(playerSlot);
                    const colorHex = color.toHex().substring(0, 6).toLowerCase();
                    richVotes.push(`[color=#${colorHex}][size=${fontSize}]${votes}[/size][/color]`);
                    totalVotes += votes;
                }
            });
            let summary = `${totalVotes}`;
            if (richVotes.length > 0) {
                summary += ` (${richVotes.join(", ")})`;
            }
            summary = `[b][size=${fontSize}]${summary}[/size][/b]`;
            voteSummary.getRichText().setText(summary);
        });
    }
}
exports.AgendaOutcomeUI = AgendaOutcomeUI;
//# sourceMappingURL=agenda-outcome-ui.js.map