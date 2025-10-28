import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const EidolonTerminus: UnitModifierSchemaType = {
  name: "Eidolon Terminus",
  description: "Mechs -1 hit value",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "tf-unit-upgrade", nsidName: "eidolon-terminus" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (unitAttrs && combatRoll.self.hasUnit("mech")) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat && combatRoll.getRollType() === "spaceCombat") {
        return true;
      }

      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat && combatRoll.getRollType() === "groundCombat") {
        return true;
      }
    }
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (unitAttrs) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }

      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addDice(1);
      }
    }
  },
};
