import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const ProphecyOfIxth: UnitModifierSchemaType = {
  name: "Prophecy of Ixth",
  description: "+1 to fighter's COMBAT rolls",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "agenda", nsidName: "prophecy-of-ixth" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" || rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const fighterAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("fighter");
    if (fighterAttrs) {
      const spaceCombat: CombatAttrs | undefined =
        fighterAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }

      const groundCombat: CombatAttrs | undefined =
        fighterAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(1);
      }
    }
  },
};
