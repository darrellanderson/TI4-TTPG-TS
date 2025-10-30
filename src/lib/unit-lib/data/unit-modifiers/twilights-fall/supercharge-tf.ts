import { Card } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib";
import { UnitType, UnitModifierSchemaType } from "../../../schema";
import { UnitAttrs, CombatAttrs } from "../../../unit-attrs";

export const SUPERCHARGE_CHOOSE_BEST: UnitType = "choose-best" as UnitType;
export const SUPERCHARGE_CHOOSE_WORST: UnitType = "choose-worst" as UnitType;
const _find = new Find();

export function _setSuperchargeUnitType(unitType: string): boolean {
  const card: Card | undefined = _find.findCard(
    "card.tf-ability:twilights-fall/supercharge"
  );
  if (card) {
    card.setSavedData(unitType, "unitType");
    return true;
  }
  return false;
}

// Exported for testing.
export function _getSuperchargeUnitType(combatRoll: CombatRoll): UnitType {
  let unitType: UnitType = "~~none~~" as UnitType;

  const card: Card | undefined = _find.findCard(
    "card.tf-ability:twilights-fall/supercharge"
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
        if (combatRoll.self.hasUnit(unitAttrs.getUnit())) {
          if (combatRoll.getRollType() === "spaceCombat") {
            const spaceCombat: CombatAttrs | undefined =
              unitAttrs.getSpaceCombat();
            if (spaceCombat) {
              const hit: number = spaceCombat.getHit();
              if (
                (savedData === SUPERCHARGE_CHOOSE_BEST && hit < best) ||
                (savedData === SUPERCHARGE_CHOOSE_WORST && hit > worst)
              ) {
                best = hit;
                worst = hit;
                unitType = unitAttrs.getUnit();
              }
            }
          }
        }

        if (combatRoll.getRollType() === "groundCombat") {
          const groundCombat: CombatAttrs | undefined =
            unitAttrs.getGroundCombat();
          if (groundCombat) {
            const hit: number = groundCombat.getHit();
            if (
              (savedData === SUPERCHARGE_CHOOSE_BEST && hit < best) ||
              (savedData === SUPERCHARGE_CHOOSE_WORST && hit > worst)
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

export const SuperchargeTF: UnitModifierSchemaType = {
  name: "Supercharge",
  description: "+2 to one unit's combat roll",
  triggers: [
    {
      cardClass: "tf-ability",
      nsidName: "supercharge",
    },
  ],
  owner: "self",
  priority: "choose",
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      combatRoll.getRollType() === "spaceCombat" ||
      combatRoll.getRollType() === "groundCombat"
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    // Apply to which ship?  Use a separate context menu to save to card state.
    const unitType: UnitType = _getSuperchargeUnitType(combatRoll);
    const applyTo: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get(unitType);

    if (combatRoll.getRollType() === "spaceCombat") {
      if (applyTo) {
        const applyToSpaceCombat: CombatAttrs | undefined =
          applyTo.getSpaceCombat();
        const count: number = combatRoll.self.getCount(unitType);
        if (applyToSpaceCombat && count > 0) {
          // Add the new unit with modified space combat.
          combatRoll.self.addSyntheticUnit(
            {
              name: `Supercharge (${unitType})`,
              unit: "supercharge" as UnitType,
              spaceCombat: {
                hit: applyToSpaceCombat.getHit() - 2,
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
    }

    if (combatRoll.getRollType() === "groundCombat") {
      if (applyTo) {
        const applyToGroundCombat: CombatAttrs | undefined =
          applyTo.getGroundCombat();
        const count: number = combatRoll.self.getCount(unitType);
        if (applyToGroundCombat && count > 0) {
          // Add the new unit with modified space combat.
          combatRoll.self.addSyntheticUnit(
            {
              name: `Supercharge (${unitType})`,
              unit: "supercharge" as UnitType,
              groundCombat: {
                hit: applyToGroundCombat.getHit() - 2,
                dice: applyToGroundCombat.getDice(),
                crit: applyToGroundCombat.getCrit(),
                critCount: applyToGroundCombat.getCritCount(),
                rerollMisses: applyToGroundCombat.getRerollMisses(),
              },
            },
            1
          );

          // Remove one of the original unit.
          combatRoll.self.overrideUnitCountHex.set(unitType, count - 1);
        }
      }
    }
  },
};
