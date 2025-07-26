import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const BrotherOmar: UnitModifierSchemaType = {
  name: "Brother Omar",
  description:
    "Produce an additional Infantry for their cost; it doesn't count towards production limits.",
  owner: "self",
  priority: "adjust",
  triggers: [
    { cardClass: "commander", nsidName: "brother-omar" },
    { cardClass: "alliance", nsidName: "yin" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string = "card.leader.commander:pok/brother-omar";
    return (
      combatRoll.getRollType() === "production" &&
      combatRoll.isCommanderUnlocked(commanderNsid)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const infantryAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("infantry");
    const produce: number = infantryAttrs.getProducePerCost();
    infantryAttrs.setProducePerCost(produce + 1);
    const quantity: number =
      infantryAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits();
    infantryAttrs.setProduceQuantityDoesNotCountAgainstProductionLimits(
      quantity + 1
    );
  },
};
