import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const NavarchFeng: UnitModifierSchemaType = {
  name: "Navarch Feng",
  description: "You can produce your flagship without spending resources",
  owner: "self",
  priority: "adjust",
  triggers: [
    { cardClass: "commander", nsidName: "navarch-feng" },
    { cardClass: "alliance", nsidName: "nomad" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "production";
  },
  apply: (combatRoll: CombatRoll): void => {
    const flagshipAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    flagshipAttrs.setCost(0);
  },
};
