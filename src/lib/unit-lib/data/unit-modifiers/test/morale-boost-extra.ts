import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const MoraleBoostExtra: UnitModifierSchemaType = {
  name: "Morale Boost Extra",
  description: "MORALE BOOST now applies +2 to combat rolls",
  owner: "self",
  priority: "adjust-late",
  triggers: [{ cardClass: "event", nsidName: "morale-boost-extra" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getUnitModifierNames().includes("Morale Boost");
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }

      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(1);
      }
    }
  },
};
