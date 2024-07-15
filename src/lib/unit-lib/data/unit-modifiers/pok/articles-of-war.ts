import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../../unit-lib/unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const annihilator: UnitModifierSchemaType = {
  name: "Articles of War",
  description: "Mechs lose non-SUSTAIN DAMAGE abilities",
  triggers: [{ cardClass: "agenda", nsidName: "articles-of-war" }],
  isCombat: true,
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("mech");
  },
  apply: (combatRoll: CombatRoll): void => {
    const mechAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (mechAttrs) {
      mechAttrs.setHasSustainDamage(false);
    }
  },
};
