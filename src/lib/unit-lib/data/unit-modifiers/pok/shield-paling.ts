import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const ShieldPaling: UnitModifierSchemaType = {
  name: "Shield Paling",
  description: "Infantry on planet with mech are not FRAGILE",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "mech", nsidName: "shield-paling" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "groundCombat" && combatRoll.self.hasUnit("mech");
  },
  apply: (combatRoll: CombatRoll): void => {
    const infantryAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("infantry");
    if (infantryAttrs) {
      const groundCombat: CombatAttrs | undefined =
        infantryAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(1);
      }
    }
  },
};
