import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../../unit-lib/unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const ArticlesOfWar: UnitModifierSchemaType = {
  name: "Articles of War",
  description: "Mechs lose non-SUSTAIN DAMAGE abilities",
  triggers: [{ cardClass: "agenda", nsidName: "articles-of-war" }],
  owner: "any",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("mech");
  },
  apply: (combatRoll: CombatRoll): void => {
    const mechAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (mechAttrs) {
      mechAttrs.setAntiFighterBarrage(undefined);
      mechAttrs.setBombardment(undefined);
      mechAttrs.setSpaceCannon(undefined);
      mechAttrs.setHasPlanetaryShield(false);
    }
  },
};
