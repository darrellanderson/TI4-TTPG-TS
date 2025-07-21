"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaAvailableVotesUI = void 0;
const api_1 = require("@tabletop-playground/api");
const agenda_available_votes_1 = require("../../../lib/agenda-lib/agenda-available-votes/agenda-available-votes");
const long_richtext_ui_1 = require("../../button-ui/long-richtext-ui");
/**
 * Show available votes, with externally-pokable reset.
 *
 * Feature request for editable available votes, but that
 * requires persistence.  Perhaps add +/- vote tokens homebrewers can add.
 * Or a vote +- counter?  Tokens you can flip to ignore might be cleanest.
 */
class AgendaAvailableVotesUI extends long_richtext_ui_1.LongRichTextUI {
    static getAvailableVotesRichText(fontSize) {
        const playerSlotToAvailableVotes = new agenda_available_votes_1.AgendaAvailableVotes().getPlayerSlotToAvailableVotes();
        const entries = [];
        for (const [playerSlot, availableVotes] of playerSlotToAvailableVotes) {
            const color = api_1.world.getSlotColor(playerSlot);
            const colorHex = color.toHex().substring(0, 6).toLowerCase();
            entries.push(`[color=#${colorHex}][size=${fontSize}]${availableVotes}[/size][/color]`);
        }
        return "[b]" + entries.join("  |  ") + "[/b]";
    }
    constructor(scaledWidth, scale) {
        super(scaledWidth, scale);
        this.update();
    }
    update() {
        // Temporary workaround for rich text: need to set size for bold/etc elements.
        const fontSize = Math.round(this.getRichText().getFontSize());
        const richText = AgendaAvailableVotesUI.getAvailableVotesRichText(fontSize);
        this.getRichText().setText(richText);
        return this;
    }
}
exports.AgendaAvailableVotesUI = AgendaAvailableVotesUI;
//# sourceMappingURL=agenda-available-votes-ui.js.map