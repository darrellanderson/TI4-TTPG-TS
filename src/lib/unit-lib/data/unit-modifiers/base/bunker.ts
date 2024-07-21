import { CombatAttrs } from "lib/unit-lib/unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Bunker: UnitModifierSchemaType = {
  name: "Bunker",
  description: "-4 to all BOMBARDMENT rolls",
  owner: "opponent",
  priority: "adjust",
  triggers: [{ cardClass: "action", nsidName: "bunker" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "bombardment";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const bombardment: CombatAttrs | undefined = unitAttrs.getBombardment();
      if (bombardment) {
        bombardment.addHit(-4);
      }
    }
  },
};
