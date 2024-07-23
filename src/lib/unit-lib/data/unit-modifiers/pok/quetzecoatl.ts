import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Quetzecoatl: UnitModifierSchemaType = {
  name: "Quetzecoatl",
  description:
    "Other players cannot use SPACE CANNON against your ships in this system",
  owner: "opponent",
  priority: "adjust", // mutate may add new space cannons
  triggers: [{ cardClass: "unit", nsidName: "quetzecoatl" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      combatRoll.getRollType() === "spaceCannonOffense" &&
      combatRoll.opponent.hasUnit("flagship")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.opponent.unitAttrsSet.getAll()) {
      const spaceCannon: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
      if (spaceCannon) {
        unitAttrs.setDisableSpaceCannonOffense(true);
      }
    }
  },
};
