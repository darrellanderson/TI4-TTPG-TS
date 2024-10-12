import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const TheCrownOfThalnos: UnitModifierSchemaType = {
  name: "The Crown of Thalnos",
  description:
    "Apply +1 to COMBAT rolls, reroll misses but must destroy any units that do not produce at least one hit",
  owner: "self",
  priority: "adjust",
  triggers: [
    {
      cardClass: "agenda",
      nsidName: "the-crown-of-thalnos",
      overrideSource: "base",
    },
    { cardClass: "relic", nsidName: "the-crown-of-thalnos" },
  ],
  isActiveIdle: true,
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" || rollType === "groundCombat";
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
