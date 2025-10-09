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
  priority: "choose-late",
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
    const bestUnitWithCombatAttrs: BestUnitWithCombatAttrs | undefined =
      combatRoll.bestHitUnitWithCombatAttrs();
    if (bestUnitWithCombatAttrs) {
      bestUnitWithCombatAttrs.combatAttrs.addExtraDice(1);
    }
  },
};
