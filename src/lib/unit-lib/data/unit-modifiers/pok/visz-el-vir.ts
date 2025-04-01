import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const ViszElVir: UnitModifierSchemaType = {
  name: "Visz El Vir",
  description: "Your mechs in this system roll 1 additional die during combat",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "unit", nsidName: "visz-el-vir" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "groundCombat" &&
      combatRoll.self.hasUnit("flagship") &&
      combatRoll.self.hasUnit("mech")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const mechAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (mechAttrs) {
      const mechGroundCombat: CombatAttrs | undefined =
        mechAttrs.getGroundCombat();
      if (mechGroundCombat) {
        mechGroundCombat.addDice(1);
      }
    }
  },
};
