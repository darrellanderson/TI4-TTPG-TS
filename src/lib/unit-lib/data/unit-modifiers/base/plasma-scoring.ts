import {
  BestUnitWithCombatAttrs,
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const PlasmaScoring: UnitModifierSchemaType = {
  name: "Plasma Scoring",
  description: "+1 dice to a single SPACE CANNON or BOMBARDMENT roll",
  owner: "self",
  priority: "choose",
  triggers: [{ cardClass: "technology.red", nsidName: "plasma-scoring" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "spaceCannonDefense" ||
      rollType === "spaceCannonOffense" ||
      rollType === "bombardment"
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const combatAttrs: BestUnitWithCombatAttrs | undefined =
      combatRoll.bestHitUnitWithCombatAttrs();
    if (combatAttrs) {
      combatAttrs.combatAttrs.addExtraDice(1);
    }
  },
};
