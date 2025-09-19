import { Card } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../../schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

const _find = new Find();

export function _setTheCavalryUnitType(unitType: string): boolean {
  const card: Card | undefined = _find.findCard(
    "card.promissory:pok/the-cavalry"
  );
  if (card) {
    card.setSavedData(unitType, "unitType");
    return true;
  }
  return false;
}

// Exported for testing.
export function _getTheCavalryUnitType(): UnitType {
  let unitType: UnitType = "~~none~~" as UnitType;

  const card: Card | undefined = _find.findCard(
    "card.promissory:pok/the-cavalry"
  );
  if (card) {
    const savedData: string = card.getSavedData("unitType");
    if (savedData.length > 0) {
      // Default to saved data choosing a specific unit type.
      unitType = savedData as UnitType;
    }
  }
  return unitType;
}

export const TheCavalry: UnitModifierSchemaType = {
  name: "The Cavalry",
  description:
    "One non-fighter ship gains the SUSTAIN DAMAGE, combat value, and ANTI-FIGHTER BARRAGE of the Nomad flagship (this modifier adds a new unit for AFB/space combat, right click the cavalry to choose replaced unit type).",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "promissory", nsidName: "the-cavalry" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "antiFighterBarrage" || rollType === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const memoria1: UnitAttrsSchemaType | undefined =
      TI4.unitAttrsRegistry.rawByNsid("unit:pok/memoria");
    const memoria2: UnitAttrsSchemaType | undefined =
      TI4.unitAttrsRegistry.rawByNsid(
        "card.technology.unit-upgrade:pok/memoria-2"
      );

    // Remove the replaced unit type.
    const replaceUnitType: UnitType = _getTheCavalryUnitType();
    const srcCount: number = combatRoll.self.getCount(replaceUnitType);
    if (srcCount > 0) {
      const dstCount: number = srcCount - 1;
      combatRoll.self.overrideUnitCountHex.set(replaceUnitType, dstCount);
    }

    // Add the cavalry unit, either memoria-1 or memoria-2.
    if (memoria1 && memoria2) {
      let name: string = `The Cavalry (replacing ${replaceUnitType})`;
      let memoriaWhich: UnitAttrsSchemaType = memoria1;
      const memoria2Nsid = UnitAttrs.schemaToNsid("pok", memoria2);
      if (combatRoll.find.findCard(memoria2Nsid) !== undefined) {
        name = `The Cavalry II (replacing ${replaceUnitType})`;
        memoriaWhich = memoria2;
      }
      const cavalry: UnitAttrsSchemaType = {
        ...memoriaWhich,
        name,
        unit: "the-cavalry" as UnitType,
      };
      combatRoll.self.addSyntheticUnit(cavalry, 1);
    }
  },
};
