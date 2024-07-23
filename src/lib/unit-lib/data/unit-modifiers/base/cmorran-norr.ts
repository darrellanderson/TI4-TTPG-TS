import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const CmorranNorr: UnitModifierSchemaType = {
  name: "C'morran N'orr",
  description: "+1 to all COMBAT rolls for other ships with the C'morran N'orr",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "unit", nsidName: "cmorran-norr" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCombat" || rollType === "groundCombat") &&
      combatRoll.self.hasUnit("flagship")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.isShip()) {
        const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
        if (spaceCombat) {
          spaceCombat.addHit(1);
        }
        const groundCombat: CombatAttrs | undefined =
          unitAttrs.getGroundCombat();
        if (groundCombat) {
          groundCombat.addHit(1);
        }
      }
    }
  },
};
