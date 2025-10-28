import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const ValefarPrime: UnitModifierSchemaType = {
  name: "Valefar Prime",
  description: "Mechs -1 cost",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "tf-unit-upgrade", nsidName: "valefar-prime" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "production";
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (unitAttrs) {
      const cost: number | undefined = unitAttrs.getCost();
      if (cost !== undefined && cost > 0) unitAttrs.setCost(cost - 1);
    }
  },
};
