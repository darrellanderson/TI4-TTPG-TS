import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const ConventionsOfWar: UnitModifierSchemaType = {
  name: "Conventions of War",
  description:
    "Players cannot use BOMBARDMENT against units that are on cultural planets",
  owner: "any",
  priority: "adjust",
  triggers: [{ cardClass: "agenda", nsidName: "conventions-of-war" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      combatRoll.getRollType() === "bombardment" &&
      combatRoll.planet !== undefined &&
      combatRoll.planet.getTraits().includes("cultural")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.getBombardment() !== undefined) {
        unitAttrs.setDisableBombardment(true);
      }
    }
  },
};
