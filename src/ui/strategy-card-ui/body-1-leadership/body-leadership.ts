import { Player, Slider, TextJustification } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { CONFIG } from "../../config/config";
import { LabelUI } from "../../button-ui/label-ui";
import { SliderWithValueUI } from "../../button-ui/slider-with-value-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

export class BodyLeadership extends AbstractStrategyCardBody {
  private _tokenCount: number = 0;

  readonly _onSliderChanged = (
    _slider: Slider,
    _player: Player,
    value: number
  ): void => {
    this._tokenCount = value;
    this.setState(value.toString());
  };

  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, 1, playerSlot);

    const state: string | undefined = this.getState();
    if (state && state.length > 0) {
      this._tokenCount = parseInt(state);
    } else if (this.isPlayingPlayer()) {
      this._tokenCount = 3;
    }
  }

  getStrategyCardName(): string {
    return "Leadership";
  }

  getBody(scale: number): AbstractUI | undefined {
    const numTokensLabel: LabelUI = new LabelUI(scale);
    numTokensLabel
      .getText()
      .setJustification(TextJustification.Left)
      .setText("Gain tokens:");

    const numTokensSlider: SliderWithValueUI = new SliderWithValueUI(scale);
    numTokensSlider
      .getSlider()
      .setMinValue(0)
      .setMaxValue(16)
      .setValue(this._tokenCount);
    numTokensSlider.getSlider().onValueChanged.add(this._onSliderChanged);
    if (this.isPlayingPlayer()) {
      numTokensSlider.getSlider().setMinValue(3);
    }

    return new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numTokensLabel, numTokensSlider])
      .build();
  }

  getReport(): string | undefined {
    return `gained ${this._tokenCount} tokens`;
  }
}
