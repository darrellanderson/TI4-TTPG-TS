import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitType } from "../../../schema/unit-attrs-schema";

export const Ambush: UnitModifierSchemaType = {
  name: "Ambush",
  description: "up to two cruisers or destroyers attack",
  triggerAlways: true,
  triggers: [],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "ambush";
  },
  apply: (combatRoll: CombatRoll): void => {
    const cruiserCount: number = combatRoll.self.getCount("cruiser");
    const destroyerCount: number = combatRoll.self.getCount("destroyer");

    // Remove all normal units from the roll.
    combatRoll.self.unitAttrsSet.getAll().forEach((unitAttrs: UnitAttrs) => {
      const unitType: UnitType = unitAttrs.getUnit();
      combatRoll.self.overrideUnitCountHex.set(unitType, 0);
    });

    // Favor cruisers.
    const cruiserRolls: number = Math.min(cruiserCount, 2);
    const destroyerRolls: number = Math.min(destroyerCount, 2 - cruiserRolls);

    const cruiserUnitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("cruiser");
    if (cruiserRolls > 0 && cruiserUnitAttrs) {
      const cruiserCombatAttrs: CombatAttrs | undefined =
        cruiserUnitAttrs.getSpaceCombat();
      if (cruiserCombatAttrs) {
        combatRoll.self.addSyntheticUnit(
          {
            name: "Ambush (cruiser)",
            unit: "ambush-cruiser" as UnitType,
            spaceCombat: {
              dice: 1,
              hit: cruiserCombatAttrs.getHit(),
            },
          },
          cruiserRolls
        );
      }
    }

    const destroyerUnitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("destroyer");
    if (destroyerRolls > 0 && destroyerUnitAttrs) {
      const destroyerCombatAttrs: CombatAttrs | undefined =
        destroyerUnitAttrs.getSpaceCombat();
      if (destroyerCombatAttrs) {
        combatRoll.self.addSyntheticUnit(
          {
            name: "Ambush (destroyer)",
            unit: "ambush-destroyer" as UnitType,
            spaceCombat: {
              dice: 1,
              hit: destroyerCombatAttrs.getHit(),
            },
          },
          destroyerRolls
        );
      }
    }
  },
};
