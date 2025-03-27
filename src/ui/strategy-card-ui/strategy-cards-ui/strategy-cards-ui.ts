import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractStrategyCardBody } from "../abstract-strategy-card-body/abstract-strategy-card-body";
import { CONFIG } from "../../config/config";
import { DivUI } from "../../div-ui/div-ui";
import { LongLabelUI } from "../../button-ui/long-label-ui";
import {
  StrategyCardNumberAndState,
  StrategyCardsState,
} from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { StrategyCardUI } from "../strategy-card-ui/strategy-card-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

import { BodyLeadership } from "../body-1-leadership/body-leadership";
import { BodyDiplomacy } from "../body-2-diplomacy/body-diplomacy";
import { BodyPolitics } from "../body-3-politics/body-politics";
import { BodyConstruction } from "../body-4-construction/body-construction";
import { BodyTrade } from "../body-5-trade/body-trade";
import { BodyWarfare } from "../body-6-warfare/body-warfare";
import { BodyTechnology } from "../body-7-technology/body-technology";
import { BodyImperial } from "../body-8-imperial/body-imperial";

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

    numbersAndStates.forEach((numberAndState, index: number): void => {
      if (index > 0) {
        const scaledLength: number =
          (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale;
        const div: AbstractUI = new DivUI(scale, scaledLength, "horizontal");
        uis.push(div);
      }

      const strategyCardNumber: number = numberAndState.number;
      let body: AbstractStrategyCardBody | undefined = undefined;
      if (strategyCardNumber === 1) {
        body = new BodyLeadership(strategyCardsState, playerSlot);
      } else if (strategyCardNumber === 2) {
        body = new BodyDiplomacy(strategyCardsState, playerSlot);
      } else if (strategyCardNumber === 3) {
        body = new BodyPolitics(strategyCardsState, playerSlot);
      } else if (strategyCardNumber === 4) {
        body = new BodyConstruction(strategyCardsState, playerSlot);
      } else if (strategyCardNumber === 5) {
        body = new BodyTrade(strategyCardsState, playerSlot);
      } else if (strategyCardNumber === 6) {
        body = new BodyWarfare(strategyCardsState, playerSlot);
      } else if (strategyCardNumber === 7) {
        body = new BodyTechnology(strategyCardsState, playerSlot);
      } else if (strategyCardNumber === 8) {
        body = new BodyImperial(strategyCardsState, playerSlot);
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
