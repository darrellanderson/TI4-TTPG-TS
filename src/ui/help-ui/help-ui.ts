import { refPackageId } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { LongRichTextUI } from "../button-ui/long-richtext-ui";
import { TwoIconLabel } from "../button-ui/two-icon-label-ui";
import { CONFIG } from "../config/config";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

const packageId: string = refPackageId;

export class HelpUI extends AbstractUI {
  constructor(scale: number) {
    const scaledWidth: number =
      (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale;

    const windowHeader: LongRichTextUI = new LongRichTextUI(scaledWidth, scale);
    windowHeader.getRichText().setText("[b]WINDOW CONTROLS:[/b]");

    const growShrinkWindow: TwoIconLabel = new TwoIconLabel(scale)
      .setIcon1("ui/window/grow.png", packageId)
      .setIcon2("ui/window/shrink.png", packageId)
      .setLabel(": [b]Grow[/b] or [b]shrink[/b] the window");
    const warpWindow: TwoIconLabel = new TwoIconLabel(scale)
      .setIcon1("ui/1x1-transparent.png", packageId)
      .setIcon2("ui/window/to-screen.png", packageId)
      .setLabel(": [b]Swap[/b] between screen / player-area");
    const collapseExpandWindow: TwoIconLabel = new TwoIconLabel(scale)
      .setIcon1("ui/window/collapse.png", packageId)
      .setIcon2("ui/window/expand.png", packageId)
      .setLabel(": [b]Collapse[/b] or [b]expand[/b] the window");
    const closeWindow: TwoIconLabel = new TwoIconLabel(scale)
      .setIcon1("ui/1x1-transparent.png", packageId)
      .setIcon2("ui/window/close.png", packageId)
      .setLabel(": [b]Close[/b] (right click table to reopen)");

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        windowHeader,
        growShrinkWindow,
        warpWindow,
        collapseExpandWindow,
        closeWindow,
      ])
      .build();
    super(ui.getWidget(), ui.getSize());
  }
}
