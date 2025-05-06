import {
  Button,
  CheckBox,
  HorizontalAlignment,
  MultilineTextBox,
  Player,
  Slider,
  TextJustification,
  VerticalAlignment,
} from "@tabletop-playground/api";
import {
  Broadcast,
  ThrottleClickHandler,
  TriggerableMulticastDelegate,
} from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { CONFIG } from "../../config/config";
import { DraftActivityStart } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start";
import { DraftActivityStartParams } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { CheckBoxUI } from "../../button-ui/checkbox-ui";
import { DivUI } from "../../div-ui/div-ui";
import { EditableUI } from "../../button-ui/editable-ui";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { LabelUI } from "../../button-ui/label-ui";
import { LongLabelUI } from "../../button-ui/long-label-ui";
import { SliderWithValueUI } from "../../button-ui/slider-with-value-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { Wekker } from "../../../lib/draft-lib/drafts/wekker";
import { ScptDraftsUi } from "./scpt-drafts-ui";
import { NucleusDraft } from "../../../lib/draft-lib/drafts/nucleus";

export class DraftStartUI extends AbstractUI {
  public readonly onDraftStarted;

  private readonly _idrafts: Array<IDraft>;
  private readonly _params: DraftActivityStartParams;
  private readonly _draftCheckBoxes: Array<CheckBox>;

  readonly _onDraftCheckStateChangedHandler = (
    checkBox: CheckBox,
    player: Player | undefined,
    _checked: boolean
  ) => {
    // Regardless of checked state, use last one the player clicked.
    if (player) {
      this._draftCheckBoxes.forEach(
        (draftCheckBox: CheckBox, index: number) => {
          const iDraft: IDraft | undefined = this._idrafts[index];
          const useThis: boolean =
            draftCheckBox.getText() === checkBox.getText();
          draftCheckBox.setIsChecked(useThis);
          console.log(
            "xxxx1",
            draftCheckBox.getText(),
            checkBox.getText(),
            useThis
          );
          if (useThis && iDraft) {
            console.log("xxxx", iDraft.getDraftName());
            // Set the current draft to the one selected by the player.
            this._params.draft = iDraft;
          }
        }
      );
    }
  };

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
      this.onDraftStarted.trigger();
      this.startDraft();
    }
  ).get();

  constructor(scale: number, params: DraftActivityStartParams) {
    const playerCount: number = TI4.config.playerCount;
    const onDraftStarted = new TriggerableMulticastDelegate<() => void>();

    const scaledWidth: number =
      (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING * 2) * scale;
    const label: LongLabelUI = new LongLabelUI(scaledWidth, scale);
    label.getText().setBold(true).setText("Custom Draft".toUpperCase());

    const sliceShapeLabel: LabelUI = new LabelUI(scale);
    sliceShapeLabel
      .getText()
      .setText("Slice shape:")
      .setJustification(TextJustification.Right);

    const iDrafts: Array<IDraft> = [
      new Milty(),
      new Wekker(),
      new NucleusDraft(),
    ];
    const draftCheckBoxUIs: Array<CheckBoxUI> = iDrafts.map(
      (idraft: IDraft): CheckBoxUI => {
        const checkBoxUi: CheckBoxUI = new CheckBoxUI(scale);
        checkBoxUi
          .getCheckBox()
          .setEnabled(idraft.isEnabled())
          .setText(idraft.getDraftName())
          .setIsChecked(idraft.getDraftName() === params.draft.getDraftName());
        return checkBoxUi;
      }
    );

    const draftCheckBoxesPanel: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(draftCheckBoxUIs)
      .build();

    const draftPanel: AbstractUI = new HorizontalUIBuilder()
      .setVerticalAlignment(VerticalAlignment.Top)
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([sliceShapeLabel, draftCheckBoxesPanel])
      .build();

    const numSlicesLabel: LabelUI = new LabelUI(scale);
    numSlicesLabel
      .getText()
      .setText("Slice count:")
      .setJustification(TextJustification.Right);
    const numSlices: SliderWithValueUI = new SliderWithValueUI(scale);
    numSlices.getSlider().setMinValue(playerCount);
    numSlices.getSlider().setMaxValue(9);
    numSlices.getSlider().setValue(params.numSlices);
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
    numFactions.getSlider().setValue(params.numFactions);
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
    customConfig.getEditText().setText(params.config);

    const startButton: ButtonUI = new ButtonUI(scale);
    startButton.getButton().setText("Start Draft");

    const rightUi: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .addUIs([
        label,
        draftPanel,
        numSlicesPanel,
        numFactionsPanel,
        customConfigPanel,
        startButton,
      ])
      .build();

    const overrideHeight: number = rightUi.getSize().h;
    const SCPT: AbstractUI = new ScptDraftsUi(
      scale,
      overrideHeight,
      onDraftStarted
    );

    const div: AbstractUI = new DivUI(scale, overrideHeight, "vertical");
    const ui: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setVerticalAlignment(VerticalAlignment.Top)
      .addUIs([SCPT, div, rightUi])
      .build();

    super(ui.getWidget(), ui.getSize());

    this.onDraftStarted = onDraftStarted;
    this._idrafts = iDrafts;
    this._params = params;
    this._draftCheckBoxes = draftCheckBoxUIs.map(
      (checkBoxUI: CheckBoxUI): CheckBox => {
        const checkBox: CheckBox = checkBoxUI.getCheckBox();
        checkBox.onCheckStateChanged.add(this._onDraftCheckStateChangedHandler);
        return checkBox;
      }
    );

    numSlices.getSlider().onValueChanged.add(this._onSliceCountChanged);
    numFactions.getSlider().onValueChanged.add(this._onFactionCountChanged);
    customConfig.getEditText().onTextCommitted.add(this._onTextCommitted);
    startButton.getButton().onClicked.add(this._onStartButtonClicked);
  }

  startDraft(): void {
    const errors: Array<string> = new Array<string>();
    new DraftActivityStart().start(this._params, errors);
    if (errors.length > 0) {
      const msg: string = errors.join("\n");
      Broadcast.chatAll("Draft start errors:\n" + msg);
    }
  }
}
