import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const X89BacterialWeapon: UnitModifierSchemaType = {
  name: "X89 Bacterial Weapon",
  description: "BOMBARDMENT and GROUND COMBAT produce 2x hits",
  owner: "self",
  priority: "choose", // need to be after adjust, so crit matches hit
  triggers: [
    {
      cardClass: "technology.green",
      nsidName: "x89-bacterial-weapon",
    },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "bombardment" || rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const bombardment: CombatAttrs | undefined = unitAttrs.getBombardment();
      if (bombardment) {
        bombardment.setCrit(bombardment.getHit());
        bombardment.setCritCount(1);
      }
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.setCrit(groundCombat.getHit());
        groundCombat.setCritCount(1);
      }
    }
  },
};
