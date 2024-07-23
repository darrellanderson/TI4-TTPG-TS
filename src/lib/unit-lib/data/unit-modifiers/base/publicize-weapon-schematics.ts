import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "lib/unit-lib/unit-attrs/unit-attrs";

export const PublicizeWeaponSchematics: UnitModifierSchemaType = {
  name: "Publicize Weapon Schematics",
  description: "War Suns lose SUSTAIN DAMAGE",
  owner: "any",
  priority: "adjust",
  triggers: [{ cardClass: "agenda", nsidName: "publicize-weapon-schematics" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "antiFighterBarrage" ||
      rollType === "spaceCannonOffense" ||
      rollType === "spaceCombat"
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    let warSun: UnitAttrs | undefined;

    warSun = combatRoll.self.unitAttrsSet.get("war-sun");
    if (warSun) {
      warSun.setDisableSustainDamage(true);
    }

    warSun = combatRoll.opponent.unitAttrsSet.get("war-sun");
    if (warSun) {
      warSun.setDisableSustainDamage(true);
    }
  },
};
