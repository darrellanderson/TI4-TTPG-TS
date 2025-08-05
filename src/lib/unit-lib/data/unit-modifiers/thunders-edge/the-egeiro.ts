import { HexType, PlayerSlot } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import {
  ControlSystemType,
  SpacePlanetOwnership,
} from "../../../../border-lib/space-planet-ownership/space-planet-ownership";
import { UnitAttrs } from "lib/unit-lib/unit-attrs/unit-attrs";
import { CombatAttrs } from "lib/unit-lib/unit-attrs/combat-attrs";

export const TheEgeiro: UnitModifierSchemaType = {
  name: "The Egeiro",
  description: "+1 for each non-home system with a controlled planet",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "unit", nsidName: "the-egeiro" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      combatRoll.getRollType() === "spaceCombat" &&
      combatRoll.self.hasUnit("flagship")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const controlledHexes: Set<HexType> = new Set();

    // How many non-home systems with controlled planets?
    const hexToControlSystemType: Map<HexType, ControlSystemType> =
      new SpacePlanetOwnership().getHexToControlSystemEntry();
    hexToControlSystemType.forEach(
      (controlSystemType: ControlSystemType, _hex: HexType) => {
        if (!controlSystemType.system.isHome()) {
          controlSystemType.planetNameToOwningPlayerSlot.forEach(
            (owningPlayerSlot: PlayerSlot, _planetName: string) => {
              if (owningPlayerSlot === combatRoll.self.playerSlot) {
                controlledHexes.add(controlSystemType.hex);
              }
            }
          );
        }
      }
    );

    // Apply.
    const unitAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    const combatAttrs: CombatAttrs = unitAttrs.getSpaceCombatOrThrow();
    combatAttrs.addHit(controlledHexes.size);
  },
};
