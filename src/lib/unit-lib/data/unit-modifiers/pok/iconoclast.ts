import { world } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const Iconoclast: UnitModifierSchemaType = {
  name: "Iconoclast",
  description: "+2 mech COMBAT rolls if opponent has fragment",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "mech", nsidName: "iconoclast" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    if (rollType === "groundCombat" && combatRoll.self.hasUnit("mech")) {
      // Look for fragment on opponent.
      const fragmentNsids = new Set([
        "card.exploration.cultural:pok/cultural-fragment",
        "card.exploration.industrial:pok/industrial-fragment",
        "card.exploration.hazardous:pok/hazardous-fragment",
        "card.exploration.frontier:pok/frontier-fragment",
      ]);
      const skipContained: boolean = true;
      for (const obj of world.getAllObjects()) {
        const nsid: string = NSID.get(obj);
        if (fragmentNsids.has(nsid)) {
          return true;
        }
      }
    }
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {
    const mechAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (mechAttrs) {
      const groundCombat: CombatAttrs | undefined = mechAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(-2);
      }
    }
  },
};
