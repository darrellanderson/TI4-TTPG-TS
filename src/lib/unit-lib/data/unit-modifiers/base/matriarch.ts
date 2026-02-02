import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitType } from "../../../schema/unit-attrs-schema";

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
    const fighterCount: number = combatRoll.self.getCount("fighter");
    if (fighter && fighterCount > 0) {
      const spaceCombat: CombatAttrs | undefined = fighter.getSpaceCombat();
      if (spaceCombat) {
        console.log("Applying Matriarch unit modifier");
        // Add as a synthetic unit to apply to all planets.
        combatRoll.self.addSyntheticUnit(
          {
            name: fighter.getName(),
            unit: (fighter.getUnit() + " (Matriarch)") as UnitType,
            groundCombat: {
              hit: spaceCombat.getHit(),
              dice: spaceCombat.getDice(),
              crit: spaceCombat.getCrit(),
            },
            isGround: true,
          },
          fighterCount
        );
      }
    }
  },
};
