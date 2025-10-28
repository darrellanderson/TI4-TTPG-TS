import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const EidolonLandwaster: UnitModifierSchemaType = {
  name: "Eidolon Landwaster",
  description: "Mechs +1 dice",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "tf-unit-upgrade", nsidName: "eidolon-landwaster" }],
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
        spaceCombat.addDice(1);
      }

      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addDice(1);
      }
    }
  },
};
