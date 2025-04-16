import { refPackageId, TextJustification } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { LongRichTextUI } from "../button-ui/long-richtext-ui";
import { TwoIconLabel } from "../button-ui/two-icon-label-ui";
import { CONFIG } from "../config/config";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { LabelUI } from "../button-ui/label-ui";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";

const packageId: string = refPackageId;

export class HelpUI extends AbstractUI {
  constructor(scale: number) {
    const scaledWidth: number =
      (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale;

    const windowHeader: LongRichTextUI = new LongRichTextUI(scaledWidth, scale);
    windowHeader.getRichText().setText("[b]WINDOW CONTROLS:[/b]");

    const growShrinkWindow: TwoIconLabel = new TwoIconLabel(scale)
      .setIcon1("ui/window/shrink.png", packageId)
      .setIcon2("ui/window/grow.png", packageId)
      .setLabel(": [b]Shrink[/b] or [b]grow[/b] the window");
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

    const numpadHeader: LongRichTextUI = new LongRichTextUI(scaledWidth, scale);
    numpadHeader.getRichText().setText("[b]NUMPAD KEYS:[/b]");

    const key1: LabelUI = new LabelUI(scale);
    key1
      .getText()
      .setJustification(TextJustification.Left)
      .setText("1: Spawn tradegood");

    const key2: LabelUI = new LabelUI(scale);
    key2
      .getText()
      .setJustification(TextJustification.Left)
      .setText("2: Spawn fighter token");

    const key3: LabelUI = new LabelUI(scale);
    key3
      .getText()
      .setJustification(TextJustification.Left)
      .setText("3: Spawn infantry token");

    const key4: LabelUI = new LabelUI(scale);
    key4
      .getText()
      .setJustification(TextJustification.Left)
      .setText("4: [reserved]");

    const key5: LabelUI = new LabelUI(scale);
    key5
      .getText()
      .setJustification(TextJustification.Left)
      .setText("5: look active system");

    const key6: LabelUI = new LabelUI(scale);
    key6
      .getText()
      .setJustification(TextJustification.Left)
      .setText("6: look map");

    const key7: LabelUI = new LabelUI(scale);
    key7
      .getText()
      .setJustification(TextJustification.Left)
      .setText("7: look scoring");

    const key8: LabelUI = new LabelUI(scale);
    key8
      .getText()
      .setJustification(TextJustification.Left)
      .setText("8: [reserved]");

    const key9: LabelUI = new LabelUI(scale);
    key9
      .getText()
      .setJustification(TextJustification.Left)
      .setText("9: look my area");

    const key0: LabelUI = new LabelUI(scale);
    key0
      .getText()
      .setJustification(TextJustification.Left)
      .setText("0: trash held objects");

    const keyRWide: LongRichTextUI = new LongRichTextUI(scaledWidth, scale);
    keyRWide
      .getRichText()
      .setJustification(TextJustification.Left)
      .setText("R: swap fighter/infantry token/plastic; 1/3 TGs");

    const left: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([key1, key2, key3, key4, key5])
      .build();
    const right: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([key6, key7, key8, key9, key0])
      .build();
    const numpadKeys: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([left, right])
      .build();

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        windowHeader,
        growShrinkWindow,
        warpWindow,
        collapseExpandWindow,
        closeWindow,
        numpadHeader,
        numpadKeys,
        keyRWide,
      ])
      .build();
    super(ui.getWidget(), ui.getSize());
  }
}
