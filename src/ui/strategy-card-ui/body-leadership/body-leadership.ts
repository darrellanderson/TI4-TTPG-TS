import { Player, Slider } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { CONFIG } from "../../config/config";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { SliderWithValueUI } from "../../button-ui/slider-with-value-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

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

  getStrategyCardNumber(): number {
    return 1;
  }

  getBody(scale: number): AbstractUI | undefined {
    const numTokensSlider: SliderWithValueUI = new SliderWithValueUI(scale);

    numTokensSlider
      .getSlider()
      .setMinValue(0)
      .setMaxValue(10)
      .setValue(this._tokenCount);

    if (this.isPlayingPlayer()) {
      numTokensSlider.getSlider().setMinValue(3);
    }

    numTokensSlider.getSlider().onValueChanged.add(this._onSliderChanged);

    return new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numTokensSlider])
      .build();
  }

  getReport(): string | undefined {
    return `retrieved ${this._tokenCount} tokens`;
  }
}
