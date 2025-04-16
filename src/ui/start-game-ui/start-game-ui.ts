import {
  CheckBox,
  HorizontalAlignment,
  Player,
  Slider,
  TextJustification,
} from "@tabletop-playground/api";
import { CONFIG } from "../config/config";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CheckBoxUI } from "../button-ui/checkbox-ui";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LongRichTextUI } from "../button-ui/long-richtext-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { ButtonUI } from "../button-ui/button-ui";
import { LabelUI } from "../button-ui/label-ui";
import { SliderWithValueUI } from "../button-ui/slider-with-value-ui";

export class StartGameUI extends AbstractUI {
  constructor(scale: number) {
    const scaledWidth: number =
      (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale;

    const gameHeader: LongRichTextUI = new LongRichTextUI(scaledWidth, scale);
    gameHeader.getRichText().setText("[b]GAME CONFIG:[/b]");

    const numPlayersLabel: LabelUI = new LabelUI(scale);
    numPlayersLabel
      .getText()
      .setJustification(TextJustification.Right)
      .setText("Number of Players:");
    const numPlayersSlider: SliderWithValueUI = new SliderWithValueUI(scale);
    numPlayersSlider
      .getSlider()
      .setMinValue(3)
      .setMaxValue(8)
      .setValue(6)
      .onValueChanged.add(
        (_slider: Slider, _player: Player, value: number): void => {
          TI4.config.setPlayerCount(value);
        }
      );

    const applySource = (source: string, enabled: boolean): void => {
      const sources: Array<string> = TI4.config.sources;
      const index: number = sources.indexOf(source);
      if (index > -1) {
        sources.splice(index, 1);
      }
      if (enabled) {
        sources.push(source);
      }
      TI4.config.setSources(sources);
    };

    const checkBoxPok: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxPok
      .getCheckBox()
      .setText("Prophecy of Kings")
      .setIsChecked(TI4.config.sources.includes("pok"))
      .onCheckStateChanged.add(
        (_checkBox: CheckBox, _player: Player, isChecked: boolean): void => {
          applySource("pok", isChecked);
        }
      );

    const checkBoxBoxShaped: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxBoxShaped
      .getCheckBox()
      .setText("Box Shaped")
      .setEnabled(false)
      .setIsChecked(TI4.config.sources.includes("box-shaped"))
      .onCheckStateChanged.add(
        (_checkBox: CheckBox, _player: Player, isChecked: boolean): void => {
          applySource("box-shaped", isChecked);
        }
      );

    const checkBoxCodex1: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxCodex1
      .getCheckBox()
      .setText("Codex 1: Ordinian")
      .setIsChecked(TI4.config.sources.includes("codex.ordinian"))
      .onCheckStateChanged.add(
        (_checkBox: CheckBox, _player: Player, isChecked: boolean): void => {
          applySource("codex.ordinian", isChecked);
        }
      );

    const checkBoxCodex2: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxCodex2
      .getCheckBox()
      .setText("Codex 2: Affinity")
      .setIsChecked(TI4.config.sources.includes("codex.affinity"))
      .onCheckStateChanged.add(
        (_checkBox: CheckBox, _player: Player, isChecked: boolean): void => {
          applySource("codex.affinity", isChecked);
        }
      );

    const checkBoxCodex3: CheckBoxUI = new CheckBoxUI(scale);
    checkBoxCodex3
      .getCheckBox()
      .setText("Codex 3: Vigil")
      .setIsChecked(TI4.config.sources.includes("codex.vigil"))
      .onCheckStateChanged.add(
        (_checkBox: CheckBox, _player: Player, isChecked: boolean): void => {
          applySource("codex.vigil", isChecked);
        }
      );

    const left: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numPlayersLabel, checkBoxPok, checkBoxBoxShaped])
      .build();
    const right: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        numPlayersSlider,
        checkBoxCodex1,
        checkBoxCodex2,
        checkBoxCodex3,
      ])
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
      .addUIs([gameHeader, config, startGameButton])
      .build();
    super(ui.getWidget(), ui.getSize());
  }
}
