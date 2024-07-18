import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "lib/unit-lib/unit-attrs/unit-attrs";

export const X: UnitModifierSchemaType = {
  name: "Brother Omar",
  description:
    "Produce an additional Infantry for their cost; it doesn't count towards production limits.",
  owner: "self",
  priority: "mutate",
  triggers: [],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "production";
  },
  apply: (combatRoll: CombatRoll): void => {
    const infantryAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("infantry");
    const produce: number = infantryAttrs.getProducePerCost();
    infantryAttrs.setProducePerCost(produce + 1);
  },
};
