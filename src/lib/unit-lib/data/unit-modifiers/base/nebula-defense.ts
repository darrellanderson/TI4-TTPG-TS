import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const NebulaDefense: UnitModifierSchemaType = {
  name: "Nebula Defense",
  description: "+1 to defender SPACE COMBAT rolls",
  owner: "self",
  priority: "adjust",
  triggerAlways: true,
  triggers: [],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    const isDefender: boolean =
      combatRoll.getActivatingPlayerSlot() !== combatRoll.self.playerSlot;
    let isNebula: boolean = false;
    if (combatRoll.system) {
      isNebula = combatRoll.system.getAnomalies().includes("nebula");
    }
    return rollType === "spaceCombat" && isNebula && isDefender;
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }
    }
  },
};
