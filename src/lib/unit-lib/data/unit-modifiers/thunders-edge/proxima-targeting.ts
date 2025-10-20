import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitType } from "../../../schema/unit-attrs-schema";

export const ProximaTargeting: UnitModifierSchemaType = {
  name: "Proxima Targeting",
  description: "Bombardment 8x3",
  triggerAlways: true,
  triggers: [],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "proximaTargeting";
  },
  apply: (combatRoll: CombatRoll): void => {
    // Remove all normal units from the roll.
    combatRoll.self.unitAttrsSet.getAll().forEach((unitAttrs: UnitAttrs) => {
      const unitType: UnitType = unitAttrs.getUnit();
      combatRoll.self.overrideUnitCountHex.set(unitType, 0);
    });

    combatRoll.self.addSyntheticUnit(
      {
        name: "Proxima Targeting",
        unit: "proxima-targeting" as UnitType,
        bombardment: {
          dice: 3,
          hit: 8,
        },
      },
      1
    );
  },
};
