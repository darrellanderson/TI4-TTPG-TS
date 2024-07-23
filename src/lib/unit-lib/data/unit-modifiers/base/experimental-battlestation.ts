import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../../schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const ExperimentalBattlestation: UnitModifierSchemaType = {
  name: "Experimental Battlestation",
  description: "One in or adjacent Space Dock gets SPACE CANNON 5x3",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "action", nsidName: "experimental-battlestation" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCannonDefense" ||
        rollType === "spaceCannonOffense") &&
      (combatRoll.self.hasUnit("space-dock") ||
        combatRoll.self.hasUnitAdj("space-dock"))
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const schema: UnitAttrsSchemaType = {
      unit: "experimental-battlestation" as UnitType,
      name: "Experimental Battlestation",
      spaceCannon: { hit: 5, dice: 3, range: 1 },
    };
    combatRoll.self.addSyntheticUnit(schema, 1);
  },
};
