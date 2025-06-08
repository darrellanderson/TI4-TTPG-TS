import { Color, world } from "@tabletop-playground/api";
import { Broadcast, DiceGroup, DiceParams, DiceResult } from "ttpg-darrell";
import { CombatAttrs } from "../../unit-lib/unit-attrs/combat-attrs";
import { CombatRoll } from "../combat-roll/combat-roll";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";

export type UnitRollsSummary = {
  diceParams: DiceParams;
  hits: number;
  diceWithHitsCritsAndRerolls: Array<string>;
};

/**
 * Generate a text summary of a combat roll,
 * including a method to broadcast that summary.
 */
export class CombatRollSummary {
  private readonly _combatRoll: CombatRoll;
  private readonly _diceResults: Array<DiceResult>;

  /**
   * Convert a pile of dice into per-unit summaries.
   *
   * @param diceResults
   * @returns
   */
  static getUnitRollsSummaries(
    diceResults: Array<DiceResult>
  ): Map<UnitType, UnitRollsSummary> {
    const result: Map<UnitType, UnitRollsSummary> = new Map();

    for (const diceResult of diceResults) {
      const unit: UnitType = diceResult.diceParams.id as UnitType;
      let unitRollsSummary: UnitRollsSummary | undefined = result.get(unit);
      if (!unitRollsSummary) {
        unitRollsSummary = {
          diceParams: diceResult.diceParams,
          hits: 0,
          diceWithHitsCritsAndRerolls: [],
        };
        result.set(unit, unitRollsSummary);
      }

      // Add hits and crits.
      if (diceResult.hit) {
        unitRollsSummary.hits += 1;
      }
      if (diceResult.crit) {
        unitRollsSummary.hits += diceResult.diceParams.critCount ?? 1;
      }

      // Format.
      const formatted: string = DiceGroup.format(diceResult);
      unitRollsSummary.diceWithHitsCritsAndRerolls.push(formatted);
    }

    return result;
  }

  /**
   * Convert per-unit summaries into an overall summary.
   *
   * @param combatRoll
   * @param unitRollsSummaries
   * @returns
   */
  static getSimpleSummary(
    combatRoll: CombatRoll,
    unitRollsSummaries: Map<UnitType, UnitRollsSummary>
  ): string {
    const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
      combatRoll._getUnitToCombatAttrs();

    let totalHits: number = 0;
    const unitResults: Array<string> = [];
    for (const [unit, unitRollsSummary] of unitRollsSummaries.entries()) {
      const unitAttrs: UnitAttrs | undefined =
        combatRoll.self.unitAttrsSet.get(unit);
      const hitValue: number | undefined = unitRollsSummary.diceParams.hit;
      if (unitAttrs && hitValue !== undefined) {
        const unitName: string = unitAttrs.getName();
        totalHits += unitRollsSummary.hits;
        let critValue: string = "";
        if (unitRollsSummary.diceParams.crit) {
          critValue = `|${unitRollsSummary.diceParams.crit}`;
        }

        let dice: string = "";
        const combatAttrs: CombatAttrs | undefined =
          unitToCombatAttrs.get(unit);
        if (combatAttrs) {
          const diceCount: number = combatAttrs.getDice();
          if (diceCount > 1) {
            dice = `x${diceCount}`;
          }
        }

        const formatted: string = `${unitName} (${hitValue}${critValue}${dice}): ${unitRollsSummary.diceWithHitsCritsAndRerolls}`;
        unitResults.push(formatted);
      }
    }

    const playerName: string = TI4.playerName.getBySlot(
      combatRoll.self.playerSlot
    );
    const combinedUnitResults: string = unitResults.join(", ");
    const modifiers: Array<string> =
      combatRoll.getUnitModifierNamesWithDescriptions();
    if (modifiers.length === 0) {
      modifiers.push("no modifiers");
    }

    return `${playerName} rolled ${totalHits} hits: ${combinedUnitResults}\nModifiers: ${modifiers.join(", ")}`;
  }

  /**
   * Summarize only this combat roll result, not reusable for other rolls.
   *
   * @param combatRoll
   * @param diceResults
   */
  constructor(combatRoll: CombatRoll, diceResults: Array<DiceResult>) {
    this._combatRoll = combatRoll;
    this._diceResults = diceResults;
  }

  /**
   * Broadcast summary to all players, colored by the rolling player's slot.
   */
  broadcastAll(): void {
    const unitRollsSummaries: Map<UnitType, UnitRollsSummary> =
      CombatRollSummary.getUnitRollsSummaries(this._diceResults);
    const simpleSummary: string = CombatRollSummary.getSimpleSummary(
      this._combatRoll,
      unitRollsSummaries
    );

    const rollingPlayerSlot: number = this._combatRoll.self.playerSlot;
    let color: Color | undefined = world.getSlotColor(rollingPlayerSlot);
    if (rollingPlayerSlot === 19 || !color) {
      color = TI4.playerColor.getAnonymousColor();
    }

    Broadcast.broadcastAll(simpleSummary, color);
  }
}
