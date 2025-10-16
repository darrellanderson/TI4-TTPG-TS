import { Card } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib";
import { UnitType, UnitModifierSchemaType } from "../../../schema";
import { UnitAttrs, CombatAttrs } from "../../../unit-attrs";

export const GRAVLEASH_CHOOSE_BEST: UnitType = "choose-best" as UnitType;
export const GRAVLEASH_CHOOSE_WORST: UnitType = "choose-worst" as UnitType;
const _find = new Find();

export function _setGravleashUnitType(unitType: string): boolean {
  const card: Card | undefined = _find.findCard(
    "card.breakthrough:thunders-edge/gravleash-maneuvers"
  );
  if (card) {
    card.setSavedData(unitType, "unitType");
    return true;
  }
  return false;
}

// Exported for testing.
export function _getGravleashUnitType(combatRoll: CombatRoll): UnitType {
  let unitType: UnitType = "~~none~~" as UnitType;

  const card: Card | undefined = _find.findCard(
    "card.breakthrough:thunders-edge/gravleash-maneuvers"
  );
  if (card) {
    const savedData: string = card.getSavedData("unitType");
    if (savedData.length > 0) {
      // Default to saved data choosing a specific unit type.
      unitType = savedData as UnitType;

      // Optionally choose best (priortize single hit) or worst (prioritize more hits).
      let best: number = 1000;
      let worst: number = -1000;
      combatRoll.self.unitAttrsSet.getAll().forEach((unitAttrs: UnitAttrs) => {
        if (
          unitAttrs.isShip() &&
          combatRoll.self.hasUnit(unitAttrs.getUnit())
        ) {
          const spaceCombat: CombatAttrs | undefined =
            unitAttrs.getSpaceCombat();
          if (spaceCombat) {
            const hit: number = spaceCombat.getHit();
            if (
              (savedData === GRAVLEASH_CHOOSE_BEST && hit < best) ||
              (savedData === GRAVLEASH_CHOOSE_WORST && hit > worst)
            ) {
              best = hit;
              worst = hit;
              unitType = unitAttrs.getUnit();
            }
          }
        }
      });
    }
  }
  return unitType;
}

export const GravleashManeuvers: UnitModifierSchemaType = {
  name: "Gravleash Maneuvers",
  description: "+X to one ship's combat roll, X is the number of ship types",
  triggers: [
    {
      cardClass: "breakthrough",
      nsidName: "gravleash-maneuvers",
    },
  ],
  owner: "self",
  priority: "choose",
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    let numShipTypes = 0;
    combatRoll.self.unitAttrsSet.getAll().forEach((unitAttrs) => {
      if (unitAttrs.isShip() && combatRoll.self.hasUnit(unitAttrs.getUnit())) {
        numShipTypes++;
      }
    });

    // Apply to which ship?  Use a separate context menu to save to card state.
    const unitType: UnitType = _getGravleashUnitType(combatRoll);

    const applyTo: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get(unitType);
    if (applyTo) {
      const applyToSpaceCombat: CombatAttrs | undefined =
        applyTo.getSpaceCombat();
      const count: number = combatRoll.self.getCount(unitType);
      if (applyToSpaceCombat && count > 0) {
        // Add the new unit with modified space combat.
        combatRoll.self.addSyntheticUnit(
          {
            name: `Gravleash Maneuvers (${unitType})`,
            unit: "gravleash-maneuvers" as UnitType,
            spaceCombat: {
              hit: applyToSpaceCombat.getHit() - numShipTypes,
              dice: applyToSpaceCombat.getDice(),
              crit: applyToSpaceCombat.getCrit(),
              critCount: applyToSpaceCombat.getCritCount(),
              rerollMisses: applyToSpaceCombat.getRerollMisses(),
            },
          },
          1
        );

        // Remove one of the original unit.
        combatRoll.self.overrideUnitCountHex.set(unitType, count - 1);
      }
    }
  },
};
