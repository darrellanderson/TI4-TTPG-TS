import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { UnitPlastic } from "../../../unit-plastic";

export function _numMechInSpace(combatRoll: CombatRoll): number {
  let numMechInSpace = 0;
  combatRoll.self.unitPlasticHex.forEach((plastic: UnitPlastic): void => {
    if (
      plastic.getUnit() === "mech" &&
      plastic.getPlanetExact() === undefined
    ) {
      numMechInSpace++;
    }
  });
  return numMechInSpace;
}

export const Colada: UnitModifierSchemaType = {
  name: "Colada",
  description: "When transported, 1 unit with capacity gets 1 extra die",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "unit", nsidName: "colada" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCombat" || rollType === "groundCombat") &&
      _numMechInSpace(combatRoll) > 0
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    let bestCombatAttrs: CombatAttrs | undefined;
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      let combatAttrs: CombatAttrs | undefined;
      if (combatRoll.getRollType() === "spaceCombat") {
        combatAttrs = unitAttrs.getSpaceCombat();
      } else if (combatRoll.getRollType() === "groundCombat") {
        combatAttrs = unitAttrs.getGroundCombat();
      }

      const capacity: number | undefined = unitAttrs.getCapacity();
      if (
        combatRoll.self.hasUnit(unitAttrs.getUnit()) &&
        combatAttrs &&
        capacity !== undefined &&
        capacity > 0
      ) {
        if (
          !bestCombatAttrs ||
          combatAttrs.getHit() < bestCombatAttrs.getHit()
        ) {
          bestCombatAttrs = combatAttrs;
        }
      }
    }
    if (bestCombatAttrs) {
      const extra: number = _numMechInSpace(combatRoll);
      bestCombatAttrs.addExtraDice(extra);
    }
  },
};
