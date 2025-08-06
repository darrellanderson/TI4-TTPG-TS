import { UnitPlastic } from "../../../unit-plastic/unit-plastic";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../../schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const ExperimentalBattlestation: UnitModifierSchemaType = {
  name: "Experimental Battlestation",
  description: "One in or adjacent Space Dock gets SPACE CANNON 5x3",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "action", nsidName: "experimental-battlestation" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCannonDefense" ||
        rollType === "spaceCannonOffense") &&
      (combatRoll.self.hasUnit("space-dock") ||
        combatRoll.self.hasUnitAdj("space-dock"))
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    // A galvanized space dock adds an extra dice.
    // Look for one and use a synthetic unit.  Do not modify
    // the existing space dock and override the count, let a
    // faction have space docks with space cannon.
    const isGalvanizedSpaceDock = (unitPlastic: UnitPlastic): boolean => {
      const linkedPlastic: UnitPlastic | undefined =
        unitPlastic.getLinkedPlastic();
      return (
        unitPlastic.getUnit() === "galvanize-token" &&
        linkedPlastic !== undefined &&
        linkedPlastic.getUnit() === "space-dock"
      );
    };
    const hasGalvanizedSpaceDock: boolean =
      combatRoll.self.unitPlasticHex.some(isGalvanizedSpaceDock) ||
      combatRoll.self.unitPlasticAdj.some(isGalvanizedSpaceDock);
    const extraDice: number = hasGalvanizedSpaceDock ? 1 : 0;

    const schema: UnitAttrsSchemaType = {
      unit: "experimental-battlestation" as UnitType,
      name: "Experimental Battlestation",
      spaceCannon: { hit: 5, dice: 3, range: 1, extraDice },
    };
    combatRoll.self.addSyntheticUnit(schema, 1);
  },
};
