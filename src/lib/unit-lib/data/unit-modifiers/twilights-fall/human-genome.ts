import {
  BestUnitWithCombatAttrs,
  CombatRoll,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const HumanGenome: UnitModifierSchemaType = {
  name: "Human Genome",
  description: "One unit's GROUND COMBAT rolls an extra die",
  owner: "self",
  priority: "choose",
  triggers: [{ cardClass: "tf-genome", nsidName: "human-genome" }],
  isActiveIdle: true,
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const best: BestUnitWithCombatAttrs | undefined =
      combatRoll.bestHitUnitWithCombatAttrs();
    if (best) {
      best.combatAttrs.addDice(1);
    }
  },
};
