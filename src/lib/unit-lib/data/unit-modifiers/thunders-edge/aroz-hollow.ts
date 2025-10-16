import { CombatRoll, CombatRollType } from "../../../../combat-lib";
import { UnitModifierSchemaType } from "../../../schema";
import { CombatAttrs } from "../../../unit-attrs";

export const ArozHollow: UnitModifierSchemaType = {
  name: "Aroz Hollow",
  description: "+1 to combat rolls in the fracture",
  owner: "self",
  priority: "adjust",
  triggers: [
    { cardClass: "commander", nsidName: "aroz-hollow" },
    { cardClass: "alliance", nsidName: "obsidian" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string =
      "card.leader.commander:thunders-edge/aroz-hollow";
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      combatRoll.system !== undefined &&
      combatRoll.system.getClass() === "fracture" &&
      (rollType === "spaceCombat" || rollType === "groundCombat") &&
      combatRoll.isCommanderUnlocked(commanderNsid)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }

      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(1);
      }
    }
  },
};
