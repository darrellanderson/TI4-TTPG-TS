import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const annihilator: UnitModifierSchemaType = {
  name: "Annihilator",
  description: "Mech in the space area gain bombardment",
  triggers: [{ cardClass: "mech", nsidName: "annihilator" }],
  isCombat: true,
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      (combatRoll.getRollType() === "bombardment" ||
        combatRoll.getRollType() === "groundCombat") &&
      combatRoll.self.hasUnit("mech")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    if (combatRoll.getRollType() === "bombardment") {
      const spaceCount: number = combatRoll.self.unitPlasticHex.filter(
        (plastic) => plastic.getPlanetExact() === undefined
      ).length;
      combatRoll.self.overrideUnitCountHex.set("mech", spaceCount);
    } else if (
      combatRoll.getRollType() === "groundCombat" &&
      combatRoll.planetName !== undefined
    ) {
      const groundCount: number = combatRoll.self.unitPlasticHex.filter(
        (plastic) =>
          plastic.getPlanetExact()?.getName() === combatRoll.planetName
      ).length;
      combatRoll.self.overrideUnitCountHex.set("mech", groundCount);
    }
  },
};
