import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType } from "../../../schema";
import { CombatAttrs } from "../../../unit-attrs";

export const CosmicPhenomenae: UnitModifierSchemaType = {
  name: "Cosmic Phenomenae",
  description:
    "Nebulae defenders gains an extra +2, fighters without move do not participate in asteroid fields",
  owner: "any",
  priority: "adjust-late",
  triggers: [{ cardClass: "event", nsidName: "cosmic-phenomenae" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getUnitModifierNames().includes("Nebula Defense");
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(2);
      }
    }
  },
};
