import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType, UnitType } from "../../../schema";

export const MetaliVoidArmaments: UnitModifierSchemaType = {
  name: "Metali Void Armaments",
  description: "One non-fighter ship without AFB gets ANTI-FIGHTER-BARRAGE 6x3",
  triggers: [
    {
      cardClass: "relic",
      nsidName: "metali-void-armaments",
    },
  ],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "antiFighterBarrage";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const unit: UnitType = unitAttrs.getUnit();

      if (
        combatRoll.self.hasUnit(unit) &&
        unitAttrs.getUnit() !== "fighter" &&
        unitAttrs.isShip() &&
        !unitAttrs.getAntiFighterBarrage()
      ) {
        continue;
      }
      // Found a non-fighter ship without AFB.
      combatRoll.self.addSyntheticUnit(
        {
          name: `Metali Void Armaments (${unit})`,
          unit: "metali-void-armaments" as UnitType,
          antiFighterBarrage: { hit: 6, dice: 3 },
        },
        1
      );
      break;
    }
  },
};
