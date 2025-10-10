import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitPlastic } from "../../../unit-plastic/unit-plastic";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";

function _getRelevantGalvanizeTokens(
  combatRoll: CombatRoll
): Array<UnitPlastic> {
  const galvanizeTokens: Array<UnitPlastic> = [];

  for (const plastic of combatRoll.self.unitPlasticHex) {
    if (plastic.getUnit() === "galvanize-token") {
      galvanizeTokens.push(plastic);
    }
  }

  for (const plastic of combatRoll.self.unitPlasticAdj) {
    const linkedPlastic: UnitPlastic | undefined = plastic.getLinkedPlastic();
    if (plastic.getUnit() === "galvanize-token" && linkedPlastic) {
      const combatAttrs: CombatAttrs | undefined =
        combatRoll.getUnitCombatAttrs(linkedPlastic.getUnit());
      if (combatAttrs && combatAttrs.getRange() > 0) {
        galvanizeTokens.push(plastic);
      }
    }
  }

  return galvanizeTokens.filter((galvanizeToken: UnitPlastic): boolean => {
    const linkedPlastic: UnitPlastic | undefined =
      galvanizeToken.getLinkedPlastic();
    return (
      linkedPlastic !== undefined &&
      linkedPlastic.getOwningPlayerSlot() === combatRoll.self.playerSlot
    );
  });
}

export const Galvanize: UnitModifierSchemaType = {
  name: "Galvanize",
  description:
    "Galvanized units gain an extra die for combat rolls and unit abilities",
  owner: "any",
  priority: "adjust",
  triggers: [{ cardClass: "faction-ability", nsidName: "galvanize" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const combatRollOrUnitAbility: Set<CombatRollType> = new Set([
      "spaceCannonOffense",
      "antiFighterBarrage",
      "spaceCombat",
      "bombardment",
      "spaceCannonDefense",
      "groundCombat",
    ]);
    return (
      combatRollOrUnitAbility.has(combatRoll.getRollType()) &&
      _getRelevantGalvanizeTokens(combatRoll).length > 0
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const galvanizeTokens: Array<UnitPlastic> =
      _getRelevantGalvanizeTokens(combatRoll);
    galvanizeTokens.forEach((token: UnitPlastic) => {
      const linkedPlastic: UnitPlastic | undefined = token.getLinkedPlastic();
      if (linkedPlastic) {
        const unit: UnitType = linkedPlastic.getUnit();
        const combatAttrs: CombatAttrs | undefined =
          combatRoll.getUnitCombatAttrs(unit);
        if (combatAttrs) {
          combatAttrs.addExtraDice(1);
        }
      }
    });
  },
};
