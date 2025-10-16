import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType } from "../../../schema";
import { CombatAttrs } from "../../../unit-attrs";

export const WildWildGalaxy: UnitModifierSchemaType = {
  name: "Wild Wild Galaxy",
  description: "Morale Boost gains an extra +1",
  owner: "self",
  priority: "adjust-late",
  triggers: [{ cardClass: "event", nsidName: "wild-wild-galaxy" }],
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
