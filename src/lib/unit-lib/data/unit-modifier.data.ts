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
    {
      name: "Annihilator",
      description: "Mech in the space area gain bombardment",
      triggers: [{ cardClass: "mech", nsidName: "annihilator" }],
      isCombat: true,
      owner: "self",
      priority: "mutate",
      applies: (combatRoll: CombatRoll): boolean => {
        console.log(
          "xxx1",
          combatRoll.getRollType(),
          combatRoll.self.hasUnit("mech")
        );
        return (
          (combatRoll.getRollType() === "bombardment" ||
            combatRoll.getRollType() === "groundCombat") &&
          combatRoll.self.hasUnit("mech")
        );
      },
      apply: (combatRoll: CombatRoll): void => {
        console.log("xxx2");
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
            (plastic) => plastic.getPlanetExact() === combatRoll.planetName
          ).length;
          combatRoll.self.overrideUnitCountHex.set("mech", groundCount);
        }
      },
    },
  ],
};
