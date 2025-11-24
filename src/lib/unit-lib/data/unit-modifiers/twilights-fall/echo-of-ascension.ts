import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const EchoOfAscension: UnitModifierSchemaType = {
  name: "Echo of Ascension",
  description: "Flagship -1 hit, +1 dice",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "tf-unit-upgrade", nsidName: "echo-of-ascension" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" && combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("flagship");
    if (unitAttrs) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
        spaceCombat.addDice(1);
      }
    }
  },
};
