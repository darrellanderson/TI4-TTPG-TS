import { Broadcast, DiceGroup, DiceParams, DiceResult } from "ttpg-darrell";
import { CombatRoll } from "../combat-roll/combat-roll";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import { Color, world } from "@tabletop-playground/api";

export type UnitRollsSummary = {
  diceParams: DiceParams;
  hits: number;
  diceWithHitsCritsAndRerolls: Array<string>;
};

export class CombatRollSummary {
  private readonly _combatRoll: CombatRoll;
  private readonly _diceResults: Array<DiceResult>;

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
        const formatted: string = `${unitName} (${hitValue}${critValue}): ${unitRollsSummary.diceWithHitsCritsAndRerolls}`;
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

    return `${playerName} rolled ${totalHits} hits: ${combinedUnitResults} (${modifiers.join(", ")})`;
  }

  constructor(combatRoll: CombatRoll, diceResults: Array<DiceResult>) {
    this._combatRoll = combatRoll;
    this._diceResults = diceResults;
  }

  broadcastAll(): void {
    const unitRollsSummaries: Map<UnitType, UnitRollsSummary> =
      CombatRollSummary.getUnitRollsSummaries(this._diceResults);
    const simpleSummary: string = CombatRollSummary.getSimpleSummary(
      this._combatRoll,
      unitRollsSummaries
    );

    const rollingPlayerSlot: number = this._combatRoll.self.playerSlot;
    let color: Color | undefined = world.getSlotColor(rollingPlayerSlot);
    if (rollingPlayerSlot < 0 || !color) {
      color = TI4.playerColor.getAnonymousColor();
    }

    Broadcast.broadcastAll(simpleSummary, color);
  }
}
