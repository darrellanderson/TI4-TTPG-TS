import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const MollTerminus: UnitModifierSchemaType = {
  name: "Moll Terminus",
  description: "Other's ground forces on planet cannot SUSTAIN DAMAGE",
  owner: "opponent",
  priority: "adjust",
  triggers: [{ cardClass: "mech", nsidName: "moll-terminus" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "groundCombat" && combatRoll.opponent.hasUnit("mech");
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.isGround() && unitAttrs.hasSustainDamage()) {
        unitAttrs.setDisableSustainDamage(true);
      }
    }
  },
};
