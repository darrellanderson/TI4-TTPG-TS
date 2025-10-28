import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const MunitionsReservesTF: UnitModifierSchemaType = {
  name: "Munitions Reserves",
  description: "Spend 2 TGs to reroll space combat misses",
  owner: "self",
  priority: "adjust",
  triggers: [
    {
      cardClass: "tf-ability",
      nsidName: "munitions-reserves",
    },
  ],
  isActiveIdle: true,
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.setRerollMisses(true);
      }
    }
  },
};
