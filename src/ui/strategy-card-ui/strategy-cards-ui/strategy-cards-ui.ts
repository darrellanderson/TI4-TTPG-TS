import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { CONFIG } from "../../config/config";
import { BodyLeadership } from "../body-1-leadership/body-leadership";
import { LongLabelUI } from "../../button-ui/long-label-ui";
import {
  StrategyCardNumberAndState,
  StrategyCardsState,
} from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { StrategyCardUI } from "../strategy-card-ui/strategy-card-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

/**
 * UI with all active strategy cards.
 */
export class StrategyCardsUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(
    scale: number,
    strategyCardsState: StrategyCardsState,
    playerSlot: PlayerSlot
  ) {
    const uis: Array<AbstractUI> = [];
    const numbersAndStates: Array<StrategyCardNumberAndState> =
      strategyCardsState.active(playerSlot);

    numbersAndStates.forEach((numberAndState, _index): void => {
      let body: AbstractStrategyCardBody | undefined = undefined;
      if (numberAndState.number === 1) {
        body = new BodyLeadership(strategyCardsState, playerSlot);
      }
      if (body) {
        const ui: AbstractUI = new StrategyCardUI(
          scale,
          strategyCardsState,
          body,
          playerSlot
        );
        uis.push(ui);
      }
    });

    if (uis.length === 0) {
      const scaledWidth: number =
        (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale;
      const empty: LongLabelUI = new LongLabelUI(scaledWidth, scale);
      empty.getText().setText("No active Strategy Cards");
      uis.push(empty);
    }

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
  }

  destroy(): void {
    this._ui.destroy();
  }
}
