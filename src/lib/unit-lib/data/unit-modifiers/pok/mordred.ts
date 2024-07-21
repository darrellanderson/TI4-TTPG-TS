import { world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";

import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const Mordred: UnitModifierSchemaType = {
  name: "Mordred",
  description: "+2 mech COMBAT rolls if opponent has X/Y token",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "mech", nsidName: "mordred" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    if (rollType === "groundCombat" && combatRoll.self.hasUnit("mech")) {
      // Look for x/y token on opponent.
      const nekroTokenNsids = new Set([
        "token:base/nekro-x",
        "token:base/nekro-y",
      ]);
      const find: Find = new Find();
      const skipContained: boolean = true;
      for (const obj of world.getAllObjects(skipContained)) {
        const nsid: string = NSID.get(obj);
        if (
          nekroTokenNsids.has(nsid) &&
          find.closestOwnedCardHolderOwner(obj.getPosition()) ===
            combatRoll.opponent.playerSlot
        ) {
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
