import {
  BestUnitWithCombatAttrs,
  CombatRoll,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const AristocraticGenome: UnitModifierSchemaType = {
  name: "Aristocratic Genome",
  description: "One ship's SPACE COMBAT rolls an extra die",
  owner: "self",
  priority: "choose",
  triggers: [{ cardClass: "tf-genome", nsidName: "aristocratic-genome" }],
  isActiveIdle: true,
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const best: BestUnitWithCombatAttrs | undefined =
      combatRoll.bestHitUnitWithCombatAttrs();
    if (best) {
      best.combatAttrs.addDice(1);
    }
  },
};
