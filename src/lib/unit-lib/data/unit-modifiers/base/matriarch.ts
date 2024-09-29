import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Matriarch: UnitModifierSchemaType = {
  name: "Matriarch",
  description: "Fighters may participate in ground combat",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "unit", nsidName: "matriarch" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "groundCombat" &&
      combatRoll.self.hasUnit("flagship") &&
      combatRoll.self.hasUnit("fighter")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const fighter: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("fighter");
    if (fighter) {
      const spaceCombat: CombatAttrs | undefined = fighter.getSpaceCombat();
      if (spaceCombat) {
        fighter.setGroundCombat(
          new CombatAttrs({
            hit: spaceCombat.getHit(),
          }),
        );
      }
    }
  },
};
