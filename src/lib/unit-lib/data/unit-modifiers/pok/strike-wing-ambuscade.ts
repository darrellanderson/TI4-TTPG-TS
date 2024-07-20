import {
  BestUnitWithCombatAttrs,
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const StrikeWingAbuscade: UnitModifierSchemaType = {
  name: "Strike Wing Ambuscade",
  description:
    "+1 die to a unit ability (anti-fighter barrage, bombardment, space cannon)",
  owner: "self",
  priority: "choose",
  triggers: [{ cardClass: "promissory", nsidName: "strike_wing_ambuscade" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "antiFighterBarrage" ||
      rollType === "bombardment" ||
      rollType === "spaceCannonDefense" ||
      rollType === "spaceCannonOffense"
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
