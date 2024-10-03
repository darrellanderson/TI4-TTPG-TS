import { Card, Vector } from "@tabletop-playground/api";

import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const TekklarLegion: UnitModifierSchemaType = {
  name: "Tekklar Legion",
  description:
    "+1 to GROUND COMBAT rolls for attacker, -1 to Sardakk if opponent owns",
  owner: "any", // this one is funky
  priority: "adjust",
  triggers: [{ cardClass: "promissory", nsidName: "tekklar-legion" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    if (rollType === "groundCombat") {
      const tekklarCard: Card | undefined = combatRoll.find.findCard(
        "card.promissory:base/tekklar-legion"
      );
      if (tekklarCard) {
        const pos: Vector = tekklarCard.getPosition();
        const owner: number = combatRoll.find.closestOwnedCardHolderOwner(pos);
        let selfFactionIsNorr: boolean = false;
        if (combatRoll.self.faction) {
          selfFactionIsNorr =
            combatRoll.self.faction.getNsid() === "faction:base/norr";
        }

        return (
          owner === combatRoll.self.playerSlot ||
          (owner === combatRoll.opponent.playerSlot && selfFactionIsNorr)
        );
      }
    }
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {
    const tekklarCard: Card | undefined = combatRoll.find.findCard(
      "card.promissory:base/tekklar-legion"
    );
    let delta: number = 0;
    if (tekklarCard) {
      const pos: Vector = tekklarCard.getPosition();
      const owner: number = combatRoll.find.closestOwnedCardHolderOwner(pos);

      if (owner === combatRoll.self.playerSlot) {
        delta = 1;
      } else if (owner === combatRoll.opponent.playerSlot) {
        delta = -1;
      }
    }

    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(delta);
      }
    }
  },
};
