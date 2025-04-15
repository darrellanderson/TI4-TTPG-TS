import { HorizontalAlignment, refPackageId } from "@tabletop-playground/api";
import { CONFIG } from "../config/config";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CheckBoxUI } from "../button-ui/checkbox-ui";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LongRichTextUI } from "../button-ui/long-richtext-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { TwoIconLabel } from "./two-icon-label-ui";
import { ButtonUI } from "../button-ui/button-ui";

const packageId: string = refPackageId;

export class StartGameUI extends AbstractUI {
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

    const gameHeader: LongRichTextUI = new LongRichTextUI(scaledWidth, scale);
    gameHeader.getRichText().setText("[b]GAME CONFIG:[/b]");

    const checkBoxPok: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxPok.getCheckBox().setText("Prophecy of Kings");
    checkBoxPok.getCheckBox().setIsChecked(TI4.config.sources.includes("pok"));

    const checkBoxBoxShaped: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxBoxShaped.getCheckBox().setText("Box Shaped");
    checkBoxBoxShaped.getCheckBox().setEnabled(false);

    const checkBoxCodex1: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxCodex1.getCheckBox().setText("Codex 1: Ordinian");
    checkBoxCodex1
      .getCheckBox()
      .setIsChecked(TI4.config.sources.includes("codex.ordinian"));

    const checkBoxCodex2: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxCodex2.getCheckBox().setText("Codex 2: Affinity");
    checkBoxCodex2
      .getCheckBox()
      .setIsChecked(TI4.config.sources.includes("codex.affinity"));

    const checkBoxCodex3: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxCodex3.getCheckBox().setText("Codex 3: Vigil");
    checkBoxCodex3
      .getCheckBox()
      .setIsChecked(TI4.config.sources.includes("codex.vigil"));

    const left: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([checkBoxPok, checkBoxBoxShaped])
      .build();
    const right: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([checkBoxCodex1, checkBoxCodex2, checkBoxCodex3])
      .build();
    const config: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([left, right])
      .build();

    const startGameButton: ButtonUI = new ButtonUI(scale);
    startGameButton.getButton().setText("Start Game");

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .addUIs([
        windowHeader,
        growShrinkWindow,
        warpWindow,
        collapseExpandWindow,
        closeWindow,
        gameHeader,
        config,
        startGameButton,
      ])
      .build();
    super(ui.getWidget(), ui.getSize());
  }
}
