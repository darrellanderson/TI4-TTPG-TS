import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Maban: UnitModifierSchemaType = {
  name: "M'aban",
  description:
    "Produce an additional Fighter for their cost; it doesn't count towards production limits",
  owner: "self",
  priority: "mutate",
  triggers: [
    { cardClass: "commander", nsidName: "maban" },
    { cardClass: "alliance", nsidName: "naalu" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "production";
  },
  apply: (combatRoll: CombatRoll): void => {
    const fighterAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("fighter");
    const produce: number = fighterAttrs.getProducePerCost();
    fighterAttrs.setProducePerCost(produce + 1);
    const quantity: number =
      fighterAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits();
    fighterAttrs.setProduceQuantityDoesNotCountAgainstProductionLimits(
      quantity + 1
    );
  },
};
