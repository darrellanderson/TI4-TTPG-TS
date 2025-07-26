import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const _2ram: UnitModifierSchemaType = {
  name: "2Ram",
  description: "PLANETARY SHIELD does not prevent BOMBARDMENT",
  triggers: [
    { cardClass: "commander", nsidName: "2ram" },
    { cardClass: "alliance", nsidName: "l1z1x" },
  ],
  owner: "self",
  priority: "mutate-late",
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string = "card.leader.commander:pok/2ram";
    return (
      combatRoll.getRollType() === "bombardment" &&
      combatRoll.isCommanderUnlocked(commanderNsid)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.getBombardment()) {
        unitAttrs.setDisablePlanetaryShield(true);
      }
    }
  },
};
