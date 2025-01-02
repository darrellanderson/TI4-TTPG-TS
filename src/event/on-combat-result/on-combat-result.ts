import { DiceResult, IGlobal } from "ttpg-darrell";
import { CombatRoll } from "../../lib/combat-lib/combat-roll/combat-roll";
import { CombatRollSummary } from "../../lib/combat-lib/combat-roll-summary/combat-roll-summary";

/**
 * Report combat roll results.
 */
export class OnCombatResult implements IGlobal {
  private readonly _onCombatResultHandler = (
    combatRoll: CombatRoll,
    diceResults: Array<DiceResult>
  ): void => {
    const combatRollSummary: CombatRollSummary = new CombatRollSummary(
      combatRoll,
      diceResults
    );
    combatRollSummary.broadcastAll();
  };

  init() {
    TI4.events.onCombatResult.add(this._onCombatResultHandler);
  }

  destroy() {
    TI4.events.onCombatResult.remove(this._onCombatResultHandler);
  }
}
