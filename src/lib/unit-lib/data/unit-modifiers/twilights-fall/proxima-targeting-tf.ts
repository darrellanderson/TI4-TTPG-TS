import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitType } from "../../../schema/unit-attrs-schema";

export const ProximaTargetingTF: UnitModifierSchemaType = {
  name: "Proxima Targeting TF",
  description: "Bombardment 7x3",
  triggers: [
    {
      cardClass: "tf-ability",
      nsidName: "proxima-targeting-vi",
    },
  ],
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
        name: "Proxima Targeting TF",
        unit: "proxima-targeting" as UnitType,
        bombardment: {
          dice: 3,
          hit: 7,
        },
      },
      1
    );
  },
};
