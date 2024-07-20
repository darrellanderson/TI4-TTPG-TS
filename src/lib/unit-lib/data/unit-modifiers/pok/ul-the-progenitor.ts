import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { System } from "../../../../system-lib/system/system";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../../schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const UlTheProgenitor: UnitModifierSchemaType = {
  name: "Ul the Progenitor",
  description: "SPACE CANNON 5(x3)",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "hero", nsidName: "ul-the-progenitor" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    const system: System | undefined = combatRoll.system;
    return (
      (rollType === "spaceCannonDefense" ||
        rollType === "spaceCannonOffense") &&
      system !== undefined &&
      system.getSystemTileNumber() === 55
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const schema: UnitAttrsSchemaType = {
      unit: "ul-the-progenitor" as UnitType,
      name: "Ul the Progenitor",
      spaceCannon: {
        hit: 5,
        dice: 3,
      },
    };
    combatRoll.self.addSyntheticUnit(schema, 1);
  },
};
