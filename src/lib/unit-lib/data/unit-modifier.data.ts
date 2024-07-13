import {
  CombatRoll,
  CombatRollType,
} from "lib/combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";
import { CombatAttrs } from "../unit-attrs/combat-attrs";

export const SOURCE_TO_UNIT_MODIFIER_DATA: Record<
  string,
  Array<UnitModifierSchemaType>
> = {
  base: [
    {
      name: "Antimass Deflectors",
      description: "-1 to all SPACE CANNON rolls",
      triggers: [{ cardClass: "technology", nsidName: "antimass-deflectors" }],
      isCombat: true,
      owner: "opponent",
      priority: "adjust",
      applies: (combatRoll: CombatRoll): boolean => {
        const rollType: CombatRollType = combatRoll.getRollType();
        return (
          rollType === "spaceCannonOffense" || rollType === "spaceCannonDefense"
        );
      },
      apply: (combatRoll: CombatRoll): void => {
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
          const combatAttrs: CombatAttrs | undefined =
            unitAttrs.getSpaceCannon();
          if (combatAttrs) {
            const oldHit: number = combatAttrs.getHit();
            const newHit: number = oldHit + 1;
            combatAttrs.setHit(newHit);
          }
        }
      },
    },
  ],
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
    },
  ],
};
