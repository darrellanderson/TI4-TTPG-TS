import { PlayerSlot } from "ttpg-darrell";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

/**
 * UI with all active strategy cards.
 */
export class StrategyCardsUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(
    scale: number,
    _strategyCardsState: StrategyCardsState,
    _playerSlot: PlayerSlot
  ) {
    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .build();
    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
  }

  destroy(): void {
    this._ui.destroy();
  }
}
