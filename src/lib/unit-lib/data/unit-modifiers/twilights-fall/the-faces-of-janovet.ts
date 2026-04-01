/**
 * Flagship: "this unit gains the unit abilities and text abilities of your
 * destroyer, cruiser, and dreadnought unit upgrade technologies."
 */
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitType } from "../../../schema/unit-attrs-schema";

export const TheFacesOfJanovet: UnitModifierSchemaType = {
  name: "The Faces of Janovet",
  description:
    "Flagship gains unit and text abilities of your destroyer, cruiser, and dreadnought unit upgrade technologies.",
  owner: "self",
  priority: "mutate-late",
  triggers: [{ cardClass: "unit", nsidName: "the-faces-of-janovet" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    // Add UNIT-UPGRADE anti-fighter barrage, bombardment, and space cannon.
    const checkUnitTypes: Array<UnitType> = [
      "destroyer",
      "cruiser",
      "dreadnought",
    ];
    const upgradedAttrs: Array<UnitAttrs> = [];

    checkUnitTypes.forEach((unitType: UnitType): void => {
      const unitAttrs: UnitAttrs | undefined =
        combatRoll.self.unitAttrsSet.get(unitType);
      if (unitAttrs && unitAttrs.getName().toLowerCase() !== unitType) {
        upgradedAttrs.push(unitAttrs);
      }
    });

    const shouldOverride = (
      candidateCombatAttrs: CombatAttrs | undefined,
      flagshipCombatAttrs: CombatAttrs | undefined,
    ): boolean => {
      if (!candidateCombatAttrs) {
        return false; // no override
      }
      if (!flagshipCombatAttrs) {
        return true; // yes override, no existing attrs
      }

      // Which to use may be subjective, for now just use the better hit value.
      return candidateCombatAttrs.getHit() < flagshipCombatAttrs.getHit();
    };

    const flagshipAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    upgradedAttrs.forEach((candidateUnitAttrs: UnitAttrs): void => {
      let candidateCombatAttrs: CombatAttrs | undefined;
      let flagshipCombatAttrs: CombatAttrs | undefined;

      candidateCombatAttrs = candidateUnitAttrs.getAntiFighterBarrage();
      flagshipCombatAttrs = flagshipAttrs.getAntiFighterBarrage();
      if (shouldOverride(candidateCombatAttrs, flagshipCombatAttrs)) {
        flagshipAttrs.setAntiFighterBarrage(candidateCombatAttrs);
      }

      candidateCombatAttrs = candidateUnitAttrs.getBombardment();
      flagshipCombatAttrs = flagshipAttrs.getBombardment();
      if (shouldOverride(candidateCombatAttrs, flagshipCombatAttrs)) {
        flagshipAttrs.setBombardment(candidateCombatAttrs);
      }

      candidateCombatAttrs = candidateUnitAttrs.getSpaceCannon();
      flagshipCombatAttrs = flagshipAttrs.getSpaceCannon();
      if (shouldOverride(candidateCombatAttrs, flagshipCombatAttrs)) {
        flagshipAttrs.setSpaceCannon(candidateCombatAttrs);
      }

      if (candidateUnitAttrs.getDisableAntiFighterBarrage()) {
        flagshipAttrs.setDisableAntiFighterBarrage(true);
      }
      if (candidateUnitAttrs.getDisableBombardment()) {
        flagshipAttrs.setDisableBombardment(true);
      }
      if (candidateUnitAttrs.getDisablePlanetaryShield()) {
        flagshipAttrs.setDisablePlanetaryShield(true);
      }
      if (candidateUnitAttrs.getDisableSpaceCannonDefense()) {
        flagshipAttrs.setDisableSpaceCannonDefense(true);
      }
      if (candidateUnitAttrs.getDisableSpaceCannonOffense()) {
        flagshipAttrs.setDisableSpaceCannonOffense(true);
      }
      if (candidateUnitAttrs.getDisableSustainDamage()) {
        flagshipAttrs.setDisableSustainDamage(true);
      }
    });
  },
};
