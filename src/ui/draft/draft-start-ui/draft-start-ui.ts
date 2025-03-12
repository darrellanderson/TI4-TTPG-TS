import {
  Button,
  HorizontalAlignment,
  MultilineTextBox,
  Player,
  Slider,
  TextJustification,
} from "@tabletop-playground/api";
import { Broadcast, ThrottleClickHandler } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import {
  DraftActivityStart,
  DraftActivityStartParams,
} from "../../../lib/draft-lib/draft-activity-start/draft-activity-start";
import { EditableUI } from "../../button-ui/editable-ui";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { LabelUI } from "../../button-ui/label-ui";
import { SliderWithValueUI } from "../../button-ui/slider-with-value-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

export class DraftStartUI extends AbstractUI {
  private readonly _idraft: IDraft;
  private readonly _params: DraftActivityStartParams;

  readonly _onSliceCountChanged = (
    _slider: Slider,
    _player: Player,
    value: number
  ): void => {
    this._params.numSlices = value;
  };

  readonly _onFactionCountChanged = (
    _slider: Slider,
    _player: Player,
    value: number
  ): void => {
    this._params.numFactions = value;
  };

  readonly _onTextCommitted = (
    _textBox: MultilineTextBox,
    _player: Player,
    text: string
  ): void => {
    this._params.config = text;
  };

  readonly _onStartButtonClicked = new ThrottleClickHandler<Button>(
    (_button: Button, _player: Player) => {
      this.startDraft();
    }
  ).get();

  constructor(scale: number, idraft: IDraft, params: DraftActivityStartParams) {
    const playerCount: number = TI4.config.playerCount;

    const numSlicesLabel: LabelUI = new LabelUI(scale);
    numSlicesLabel
      .getText()
      .setText("Slice count:")
      .setJustification(TextJustification.Right);
    const numSlices: SliderWithValueUI = new SliderWithValueUI(scale);
    numSlices.getSlider().setMinValue(playerCount);
    numSlices.getSlider().setMaxValue(9);
    const numSlicesPanel: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numSlicesLabel, numSlices])
      .build();

    const numFactionsLabel: LabelUI = new LabelUI(scale);
    numFactionsLabel
      .getText()
      .setText("Faction count:")
      .setJustification(TextJustification.Right);
    const numFactions: SliderWithValueUI = new SliderWithValueUI(scale);
    numFactions.getSlider().setMinValue(playerCount);
    numFactions.getSlider().setMaxValue(9);
    const numFactionsPanel: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numFactionsLabel, numFactions])
      .build();

    const customConfigLabel: LabelUI = new LabelUI(scale);
    customConfigLabel
      .getText()
      .setText("Custom config:")
      .setJustification(TextJustification.Right);
    const customConfig: EditableUI = new EditableUI(scale);
    const customConfigPanel: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([customConfigLabel, customConfig])
      .build();

    const startButton: ButtonUI = new ButtonUI(scale);
    startButton.getButton().setText("Start Draft");

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .addUIs([
        numSlicesPanel,
        numFactionsPanel,
        customConfigPanel,
        startButton,
      ])
      .build();
    super(ui.getWidget(), ui.getSize());

    this._idraft = idraft;
    this._params = params;
    numSlices.getSlider().setValue(this._params.numSlices);
    numSlices.getSlider().onValueChanged.add(this._onSliceCountChanged);
    numFactions.getSlider().setValue(this._params.numFactions);
    numFactions.getSlider().onValueChanged.add(this._onFactionCountChanged);
    customConfig.getEditText().onTextCommitted.add(this._onTextCommitted);
    startButton.getButton().onClicked.add(this._onStartButtonClicked);
  }

  startDraft(): void {
    const errors: Array<string> = new Array<string>();
    new DraftActivityStart().start(this._idraft, this._params, errors);
    if (errors.length > 0) {
      const msg: string = errors.join("\n");
      Broadcast.chatAll("Draft start errors:\n" + msg);
    }
  }
}
