import { Card, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { System } from "../../../../system-lib/system/system";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../../schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const CustodiaVigilia: UnitModifierSchemaType = {
  name: "Custodia Vigilia",
  description: "SPACE CANNON 5, +3 prod to Mecatol Rex",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "legendary", nsidName: "custodia-vigilia" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    const system: System | undefined = combatRoll.system;
    if (
      (rollType === "spaceCannonDefense" ||
        rollType === "spaceCannonOffense") &&
      system !== undefined &&
      system.getSystemTileNumber() === 18
    ) {
      // Does player control Mecatol Rex?
      const find: Find = new Find();
      const planetCard: Card | undefined = find.findCard(
        "card.planet:base/mecatol-rex"
      );
      if (planetCard) {
        const pos: Vector = planetCard.getPosition();
        const owner: number = find.closestOwnedCardHolderOwner(pos);
        return owner === combatRoll.self.playerSlot;
      }
    }
    return false;
  },
  apply: (combatRoll: CombatRoll): void => {
    const schema: UnitAttrsSchemaType = {
      name: "Custodia Vigilia",
      unit: "custodia-vigilia" as UnitType,
      spaceCannon: {
        hit: 5,
      },
    };
    combatRoll.self.addSyntheticUnit(schema, 1);
  },
};
