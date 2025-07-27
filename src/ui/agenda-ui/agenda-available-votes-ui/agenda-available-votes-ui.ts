import { Color, world } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { AgendaAvailableVotes } from "../../../lib/agenda-lib/agenda-available-votes/agenda-available-votes";
import { LongRichTextUI } from "../../button-ui/long-richtext-ui";

/**
 * Show available votes, with externally-pokable reset.
 *
 * Feature request for editable available votes, but that
 * requires persistence.  Perhaps add +/- vote tokens homebrewers can add.
 * Or a vote +- counter?  Tokens you can flip to ignore might be cleanest.
 */
export class AgendaAvailableVotesUI extends LongRichTextUI {
  static getAvailableVotesRichText(fontSize: number): string {
    const playerSlotToAvailableVotes: Map<PlayerSlot, number> =
      new AgendaAvailableVotes().getPlayerSlotToAvailableVotes();

    fontSize = Math.max(fontSize, 6);
    fontSize = Math.min(fontSize, 24);

    const entries: Array<string> = [];
    for (const [playerSlot, availableVotes] of playerSlotToAvailableVotes) {
      const color: Color = world.getSlotColor(playerSlot);
      const colorHex: string = color.toHex().substring(0, 6).toLowerCase();
      entries.push(
        `[color=#${colorHex}][size=${fontSize}]${availableVotes}[/size][/color]`
      );
    }

    return "[b]" + entries.join("  |  ") + "[/b]";
  }

  constructor(scaledWidth: number, scale: number) {
    super(scaledWidth, scale);
    this.update();
  }

  update(): this {
    // Temporary workaround for rich text: need to set size for bold/etc elements.
    const fontSize: number = Math.round(this.getRichText().getFontSize());
    const richText: string =
      AgendaAvailableVotesUI.getAvailableVotesRichText(fontSize);
    this.getRichText().setText(richText);
    return this;
  }
}
