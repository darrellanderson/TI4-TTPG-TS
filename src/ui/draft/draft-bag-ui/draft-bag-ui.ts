import {
  Button,
  CheckBox,
  HorizontalAlignment,
  Slider,
  TextJustification,
} from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { GenerateSlicesParams } from "../../../lib/draft-lib/generate-slices/generate-slices";
import { SystemTierType } from "../../../lib/system-lib/system/system-tier";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { SliderWithValueUI } from "../../button-ui/slider-with-value-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { CheckBoxUI } from "../../button-ui/checkbox-ui";
import { LabelUI } from "../../button-ui/label-ui";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { LongLabelUI } from "../../button-ui/long-label-ui";
import { ButtonUI, ConfirmButtonUI } from "../../button-ui";

type SliderWithWrapperType = {
  slider: Slider;
  wrapper: AbstractUI;
};

function createSliderWithWrapper(
  scale: number,
  labelText: string,
  minValue: number,
  maxValue: number,
  defaultValue: number
): SliderWithWrapperType {
  const labelUi: LabelUI = new LabelUI(scale);
  labelUi
    .getText()
    .setJustification(TextJustification.Right)
    .setText(labelText);

  const sliderUi: SliderWithValueUI = new SliderWithValueUI(scale);
  sliderUi
    .getSlider()
    .setMinValue(minValue)
    .setMaxValue(maxValue)
    .setValue(defaultValue);

  const wrapper: AbstractUI = new HorizontalUIBuilder()
    .setSpacing(CONFIG.SPACING * scale)
    .addUIs([labelUi, sliderUi])
    .build();
  return {
    slider: sliderUi.getSlider(),
    wrapper: wrapper,
  };
}

/**
 * Configurable bag draft:
 * - reds [2-3] (default 2)
 * - blues tier high/med/low [1-2] (default 1/1/1)
 * - factions [1-4] (default 2)
 * - min total alpha wormholes [0-3] (default 2)
 * - min total beta wormholes (default 2)
 * - min total legendaries (default 2)
 * - use factions on table [x] (default off)
 */
export class DraftBagUI extends AbstractUI {
  private _numReds: Slider;
  private _numBluesHigh: Slider;
  private _numBluesMed: Slider;
  private _numBluesLow: Slider;
  private _numFactions: Slider;
  private _minAlphas: Slider;
  private _minBetas: Slider;
  private _minLegendaries: Slider;
  private _useFactionsOnTable: CheckBox;
  private _startButton: Button;

  constructor(scale: number) {
    const width2x: number = CONFIG.BUTTON_WIDTH * scale * 2;
    const perBagHeader: LongLabelUI = new LongLabelUI(width2x, scale);
    perBagHeader.getText().setText("Per Bag Counts:").setBold(true);

    const numReds: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Red:",
      2,
      3,
      2
    );

    const numBluesHigh: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Blue (high):",
      1,
      2,
      1
    );
    const numBluesMed: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Blue (med):",
      1,
      2,
      1
    );
    const numBluesLow: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Blue (low):",
      1,
      2,
      1
    );
    const numFactions: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Factions:",
      1,
      4,
      2
    );

    const overallHeader: LongLabelUI = new LongLabelUI(width2x, scale);
    overallHeader.getText().setText("Overall Minimum Counts:").setBold(true);

    const minAlphas: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Alpha Wormholes:",
      0,
      3,
      2
    );
    const minBetas: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Beta Wormholes:",
      0,
      3,
      2
    );
    const minLegendaries: SliderWithWrapperType = createSliderWithWrapper(
      scale,
      "Legendaries:",
      0,
      3,
      2
    );

    const useFactionsOnTable: CheckBoxUI = new CheckBoxUI(scale);
    useFactionsOnTable.getCheckBox().setText("Use Factions on Table");

    const start: ButtonUI = new ButtonUI(scale);
    start.getButton().setText("Start");
    const startConfirm: ConfirmButtonUI = new ConfirmButtonUI(start);

    const overallUi: AbstractUI = new VerticalUIBuilder()
      .addUIs([
        perBagHeader,
        numReds.wrapper,
        numBluesHigh.wrapper,
        numBluesMed.wrapper,
        numBluesLow.wrapper,
        numFactions.wrapper,
        overallHeader,
        minAlphas.wrapper,
        minBetas.wrapper,
        minLegendaries.wrapper,
        useFactionsOnTable,
        startConfirm,
      ])
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .build();

    super(overallUi.getWidget(), overallUi.getSize());

    this._numReds = numReds.slider;
    this._numBluesHigh = numBluesHigh.slider;
    this._numBluesMed = numBluesMed.slider;
    this._numBluesLow = numBluesLow.slider;
    this._numFactions = numFactions.slider;
    this._minAlphas = minAlphas.slider;
    this._minBetas = minBetas.slider;
    this._minLegendaries = minLegendaries.slider;
    this._useFactionsOnTable = useFactionsOnTable.getCheckBox();
    this._startButton = start.getButton();
  }

  getGenerateSlicesParams(): GenerateSlicesParams {
    const sliceMakeup: Array<SystemTierType> = [];

    for (let i = 0; i < this._numReds.getValue(); i++) {
      sliceMakeup.push("red");
    }
    for (let i = 0; i < this._numBluesHigh.getValue(); i++) {
      sliceMakeup.push("high");
    }
    for (let i = 0; i < this._numBluesMed.getValue(); i++) {
      sliceMakeup.push("med");
    }
    for (let i = 0; i < this._numBluesLow.getValue(); i++) {
      sliceMakeup.push("low");
    }

    // Make up a slice shape (not used).
    const sliceShape: Array<HexType> = [];
    for (let i = 0; i < sliceMakeup.length; i++) {
      sliceShape.push(`<${i},0,-{i}>` as HexType);
    }

    return {
      sliceMakeups: [sliceMakeup],
      sliceShape: [],
      minAlphaWormholes: this._minAlphas.getValue(),
      minBetaWormholes: this._minBetas.getValue(),
      minLegendary: this._minLegendaries.getValue(),
    };
  }

  getNumFactions(): number {
    return this._numFactions.getValue();
  }

  getUseFactionsOnTable(): boolean {
    return this._useFactionsOnTable.isChecked();
  }

  getStartButton(): Button {
    return this._startButton;
  }
}
