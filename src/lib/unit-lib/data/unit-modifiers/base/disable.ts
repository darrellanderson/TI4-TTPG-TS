import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Disable: UnitModifierSchemaType = {
  name: "Disable",
  description: "Opponent PDS lose PLANETARY SHIELD and SPACE CANNON DEFENSE",
  owner: "opponent",
  priority: "adjust",
  triggers: [{ cardClass: "action", nsidName: "disable" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "bombardment" || rollType === "spaceCannonDefense";
  },
  apply: (combatRoll: CombatRoll): void => {
    const pds: UnitAttrs | undefined = combatRoll.self.unitAttrsSet.get("pds");
    if (pds) {
      pds.setDisablePlanetaryShield(true);
      pds.setDisableSpaceCannonDefense(true);
    }
  },
};
