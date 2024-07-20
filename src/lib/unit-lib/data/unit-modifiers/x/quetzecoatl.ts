import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "lib/unit-lib/unit-attrs/unit-attrs";

export const Quetzecoatl: UnitModifierSchemaType = {
  name: "Quetzecoatl",
  description:
    "Other players cannot use SPACE CANNON against your ships in this system",
  owner: "opponent",
  priority: "mutate",
  triggers: [{ cardClass: "flagship", nsidName: "quetzecoatl" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCannonOffense";
  },
  apply: (combatRoll: CombatRoll): void => {
    const flagship: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    flagship.setDisableSpaceCannonOffense(true);
  },
};
