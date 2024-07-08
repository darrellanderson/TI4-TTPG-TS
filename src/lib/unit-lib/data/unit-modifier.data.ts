import { CombatRoll } from "lib/combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";

export const SOURCE_TO_UNIT_MODIFIER_DATA: Record<
  string,
  Array<UnitModifierSchemaType>
> = {
  base: [],
  pok: [
    {
      name: "2Ram",
      description: "PLANETARY SHIELD does not prevent BOMBARDMENT",
      triggers: [
        { cardClass: "commander", nsidName: "2ram" },
        { cardClass: "alliance", nsidName: "l1z1x" },
      ],
      isCombat: true,
      owner: "self",
      priority: "mutate-late",
      applies: (combatRoll: CombatRoll): boolean => {
        return combatRoll.getRollType() === "bombardment";
      },
      apply: (combatRoll: CombatRoll): void => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
          if (unitAttrs.getBombardment()) {
            unitAttrs.setDisablePlanetaryShield(true);
          }
        }
      },
    },
  ],
};
