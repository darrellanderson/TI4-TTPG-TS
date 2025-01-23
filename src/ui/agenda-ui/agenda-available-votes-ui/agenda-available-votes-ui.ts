import { HorizontalBox, Panel } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";

/**
 * Show available votes, with reset.
 *
 * Feature request for editable available votes, but that
 * requires persistence.  Perhaps add +/- vote tokens homebrewers can add.
 * Or a vote +- counter?  Tokens you can flip to ignore might be cleanest.
 */
export class AgendaAvailableVotesUI extends AbstractUI {
  constructor(scaledWidth: number, scale: number) {
    const size: UI_SIZE = {
      w: scaledWidth,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const widget: Panel = new HorizontalBox().setChildDistance(
      CONFIG.SPACING * scale
    );

    super(widget, size);
  }
}
