import { UnitPlastic } from "../../../unit-plastic/unit-plastic";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Eidolon: UnitModifierSchemaType = {
  name: "Eidolon",
  description: "Count as ship when off planet",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "mech", nsidName: "eidolon" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCombat" || rollType === "groundCombat") &&
      combatRoll.self.hasUnit("mech")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const mechs: Array<UnitPlastic> = combatRoll.self.unitPlasticHex.filter(
      (plastic): boolean => plastic.getUnit() === "mech"
    );

    let count: number = 0;
    if (combatRoll.getRollType() === "spaceCombat") {
      count = mechs.filter(
        (plastic): boolean => plastic.getPlanetExact() === undefined
      ).length;
    } else if (combatRoll.getRollType() === "groundCombat") {
      count = mechs.filter(
        (plastic): boolean => plastic.getPlanetExact() === combatRoll.planet
      ).length;
    }
    combatRoll.self.overrideUnitCountHex.set("mech", count);
  },
};
