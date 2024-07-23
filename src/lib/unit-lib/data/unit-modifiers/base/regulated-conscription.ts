import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const RegulatedConscription: UnitModifierSchemaType = {
  name: "Regulated Conscription",
  description: "Fighters and infantry cost 1 each",
  owner: "any",
  priority: "adjust",
  triggers: [{ cardClass: "agenda", nsidName: "regulated-conscription" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "production";
  },
  apply: (combatRoll: CombatRoll): void => {
    const fighter: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("fighter");
    if (fighter) {
      fighter.setProducePerCost(1);
    }

    const infantry: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("infantry");
    if (infantry) {
      infantry.setProducePerCost(1);
    }
  },
};
