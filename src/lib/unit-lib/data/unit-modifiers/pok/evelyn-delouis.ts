import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  BestUnitWithCombatAttrs,
  CombatRoll,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const EvelynDelouis: UnitModifierSchemaType = {
  name: "Evelyn Delouis",
  description: "+1 die to a single GROUND COMBAT roll",
  owner: "self",
  priority: "choose",
  isActiveIdle: true,
  triggers: [{ cardClass: "agent", nsidName: "evelyn-delouis" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitWithCombatAttrs: BestUnitWithCombatAttrs | undefined =
      combatRoll.bestHitUnitWithCombatAttrs();
    if (unitWithCombatAttrs) {
      const combatAttrs: CombatAttrs = unitWithCombatAttrs.combatAttrs;
      combatAttrs.addExtraDice(1);
    }
  },
};
