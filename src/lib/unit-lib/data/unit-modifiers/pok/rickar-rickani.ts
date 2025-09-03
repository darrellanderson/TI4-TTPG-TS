import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { Faction } from "../../../../faction-lib/faction/faction";
import { Planet } from "../../../../system-lib/planet/planet";
import { System } from "../../../../system-lib/system/system";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const RickarRickani: UnitModifierSchemaType = {
  name: "Rickar Rickani",
  description: "+2 to combat rolls on Mecatol, your home system, and legendary",
  owner: "self",
  priority: "adjust",
  triggers: [
    { cardClass: "commander", nsidName: "rickar-rickani" },
    { cardClass: "alliance", nsidName: "winnu" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const system: System | undefined = combatRoll.system;

    const commanderNsid: string = "card.leader.commander:pok/rickar-rickani";

    if (
      system &&
      (combatRoll.getRollType() === "spaceCombat" ||
        combatRoll.getRollType() === "groundCombat")
    ) {
      // Is Mecatol?
      const tile: number = system.getSystemTileNumber();
      if (TI4.systemRegistry.isMecatolRex(tile)) {
        return combatRoll.isCommanderUnlocked(commanderNsid);
      }

      // Has a legendary planet?
      const planets: Array<Planet> | undefined = system.getPlanets();
      if (planets) {
        for (const planet of planets) {
          if (planet.isLegendary()) {
            return combatRoll.isCommanderUnlocked(commanderNsid);
          }
        }
      }

      // Is self's home system?
      const faction: Faction | undefined = combatRoll.self.faction;
      if (
        system &&
        faction &&
        system.getSystemTileNumber() === faction.getHomeSystemTileNumber()
      ) {
        return combatRoll.isCommanderUnlocked(commanderNsid);
      }
    }
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(2);
      }
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(2);
      }
    }
  },
};
