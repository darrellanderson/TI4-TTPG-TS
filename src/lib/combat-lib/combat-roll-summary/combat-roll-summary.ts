import { DiceGroup, DiceParams, DiceResult } from "ttpg-darrell";
import { CombatRoll } from "../combat-roll/combat-roll";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";

export type UnitRollsSummary = {
  diceParams: DiceParams;
  hits: number;
  diceWithHitsCritsAndRerolls: Array<string>;
};

export class CombatRollSummary {
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

  static getSimpleSummary(
    combatRoll: CombatRoll,
    unitRollsSummaries: Map<UnitType, UnitRollsSummary>
  ): string {
    const result: Array<string> = [];
    let totalHits: number = 0;
    for (const [unit, unitRollsSummary] of unitRollsSummaries.entries()) {
      const unitAttrs: UnitAttrs | undefined =
        combatRoll.self.unitAttrsSet.get(unit);
      const hitValue: number | undefined = unitRollsSummary.diceParams.hit;
      if (unitAttrs && hitValue !== undefined) {
        const name: string = unitAttrs.getName();
        totalHits += unitRollsSummary.hits;
        let critValue: string = "";
        if (unitRollsSummary.diceParams.crit) {
          critValue = `|${unitRollsSummary.diceParams.crit}`;
        }
        const formatted: string = `${name} (${hitValue}${critValue}): ${unitRollsSummary.diceWithHitsCritsAndRerolls}`;
        result.push(formatted);
      }
    }

    result.unshift(`Total hits: ${totalHits}`);
    result.push(combatRoll.getUnitModifierNamesWithDescriptions().join(", "));

    return result.filter((s) => s.length > 0).join("\n");
  }

  constructor(_combatRoll: CombatRoll, _diceResults: Array<DiceResult>) {}
}
