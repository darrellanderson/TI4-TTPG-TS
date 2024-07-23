import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "lib/unit-lib/unit-attrs/unit-attrs";

export const FighterPrototype: UnitModifierSchemaType = {
  name: "Fighter Prototype",
  description: "+2 to fighters' COMBAT rolls",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "action", nsidName: "fighter-prototype" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" || rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("fighter");
    if (unitAttrs) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(2);
      }

      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(2);
      }
    }
  },
};
