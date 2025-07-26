import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const ThatWhichMoldsFlesh: UnitModifierSchemaType = {
  name: "That Which Molds Flesh",
  description:
    "When producing Infantry and/or Fighters, up to 2 do not count against the production limit",
  owner: "self",
  priority: "adjust",
  triggers: [
    { cardClass: "commander", nsidName: "that-which-molds-flesh" },
    { cardClass: "alliance", nsidName: "vuilraith" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string =
      "card.leader.commander:pok/that-which-molds-flesh";
    return (
      combatRoll.getRollType() === "production" &&
      combatRoll.isCommanderUnlocked(commanderNsid)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const infantryAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("infantry");
    if (infantryAttrs) {
      infantryAttrs.setSharedProduceQuantityDoesNotCountAgainstProductionLimits(
        2
      );
    }

    const fighterAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("fighter");
    if (fighterAttrs) {
      fighterAttrs.setSharedProduceQuantityDoesNotCountAgainstProductionLimits(
        2
      );
    }
  },
};
