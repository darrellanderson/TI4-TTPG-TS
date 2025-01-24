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
  static getAvailableVotesRichText(): string {
    const playerSlotToAvailableVotes: Map<PlayerSlot, number> =
      new AgendaAvailableVotes().getPlayerSlotToAvailableVotes();

    const entries: Array<string> = [];
    for (const [playerSlot, availableVotes] of playerSlotToAvailableVotes) {
      const color: Color = world.getSlotColor(playerSlot);
      const colorHex: string = color.toHex().substring(0, 6).toLowerCase();
      entries.push(`[color=#${colorHex}]${availableVotes}[/color]`);
    }

    return entries.join(" | ");
  }

  constructor(scaledWidth: number, scale: number) {
    super(scaledWidth, scale);
    this.update();
  }

  update(): this {
    const richText: string = AgendaAvailableVotesUI.getAvailableVotesRichText();
    this.getRichText().setText(richText);
    return this;
  }
}
