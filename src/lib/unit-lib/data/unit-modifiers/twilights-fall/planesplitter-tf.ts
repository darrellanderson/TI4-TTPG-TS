import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";

export const PlanesplitterTF: UnitModifierSchemaType = {
  name: "Planesplitter",
  description: "+2 to combat rolls in the fracture",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "tf-ability", nsidName: "planesplitter" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      combatRoll.system !== undefined &&
      combatRoll.system.getClass() === "fracture" &&
      (rollType === "spaceCombat" || rollType === "groundCombat")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(2);
      }
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(2);
      }
    }
  },
};
