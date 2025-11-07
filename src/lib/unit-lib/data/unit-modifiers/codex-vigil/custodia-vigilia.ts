import { Card, Vector } from "@tabletop-playground/api";

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
    const tile: number = system?.getSystemTileNumber() ?? -1;
    if (
      (rollType === "spaceCannonDefense" ||
        rollType === "spaceCannonOffense") &&
      system !== undefined &&
      TI4.systemRegistry.isMecatolRex(tile)
    ) {
      // Does player control Mecatol Rex?
      const nsid: string =
        tile === 18
          ? "card.planet:base/mecatol-rex"
          : "card.planet:thunders-edge/mecatol-rex";
      const planetCard: Card | undefined = combatRoll.find.findCard(nsid);
      if (planetCard) {
        const pos: Vector = planetCard.getPosition();
        const owner: number = combatRoll.find.closestOwnedCardHolderOwner(pos);
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
