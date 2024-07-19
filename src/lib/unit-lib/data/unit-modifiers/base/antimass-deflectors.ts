import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const AntimassDeflectors: UnitModifierSchemaType = {
  name: "Antimass Deflectors",
  description: "-1 to all SPACE CANNON rolls",
  triggers: [
    {
      cardClass: "technology.blue",
      nsidName: "antimass-deflectors",
    },
  ],
  owner: "opponent",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "spaceCannonOffense" || rollType === "spaceCannonDefense"
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const combatAttrs: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
      if (combatAttrs) {
        const oldHit: number = combatAttrs.getHit();
        const newHit: number = oldHit + 1;
        combatAttrs.setHit(newHit);
      }
    }
  },
};
