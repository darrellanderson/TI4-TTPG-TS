import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Unrelenting: UnitModifierSchemaType = {
  name: "Unrelenting",
  description: "+1 to all COMBAT rolls",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "faction-ability", nsidName: "unrelenting" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" || rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(1);
      }
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }
    }
  },
};
