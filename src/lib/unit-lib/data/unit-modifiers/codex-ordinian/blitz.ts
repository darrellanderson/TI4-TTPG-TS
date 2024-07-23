import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Blitz: UnitModifierSchemaType = {
  name: "Blitz",
  description: "BOMBARDMENT 6 to non-fighter, non-bomdbardment ships",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "action", nsidName: "blitz" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "bombardment";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.isShip() && unitAttrs.getUnit() !== "fighter") {
        let bombardment: CombatAttrs | undefined = unitAttrs.getBombardment();
        if (!bombardment) {
          bombardment = new CombatAttrs({ hit: 6 });
          unitAttrs.setBombardment(bombardment);
        }
      }
    }
  },
};
