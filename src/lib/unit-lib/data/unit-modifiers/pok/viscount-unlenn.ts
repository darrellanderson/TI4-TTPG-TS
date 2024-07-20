import {
  BestUnitWithCombatAttrs,
  CombatRoll,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const ViscountUnlenn: UnitModifierSchemaType = {
  name: "Viscount Unlenn",
  description: "+1 die to a single SPACE COMBAT roll",
  owner: "self",
  priority: "choose",
  isActiveIdle: true,
  triggers: [{ cardClass: "agent", nsidName: "viscount-unlenn" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const attrs: BestUnitWithCombatAttrs | undefined =
      combatRoll.bestHitUnitWithCombatAttrs();
    if (attrs) {
      attrs.combatAttrs.addExtraDice(1);
    }
  },
};
