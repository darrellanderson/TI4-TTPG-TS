import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const arviconRex: UnitModifierSchemaType = {
  name: "Arvicon Rex",
  description:
    "+2 flagship COMBAT against opponent with no token in your fleet pool",
  owner: "self",
  priority: "adjust",
};
