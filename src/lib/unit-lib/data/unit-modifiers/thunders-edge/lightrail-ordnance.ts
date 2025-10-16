import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType } from "../../../schema";
import { CombatAttrs } from "../../../unit-attrs";

export const LightrailOrdnance: UnitModifierSchemaType = {
  name: "Lightrail Ordnance",
  description: "Space Docks get SPACE CANNON 5x2 range 1",
  triggers: [
    {
      cardClass: "relic",
      nsidName: "lightrail-ordnance",
    },
  ],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    if (
      combatRoll.getRollType() !== "spaceCannonOffense" &&
      combatRoll.getRollType() !== "spaceCannonDefense"
    ) {
      return false;
    }
    return (
      combatRoll.self.hasUnit("space-dock") ||
      combatRoll.self.hasUnitAdj("space-dock")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    combatRoll.self.unitAttrsSet
      .getOrThrow("space-dock")
      .setSpaceCannon(new CombatAttrs({ hit: 5, dice: 2, range: 1 }));
  },
};
