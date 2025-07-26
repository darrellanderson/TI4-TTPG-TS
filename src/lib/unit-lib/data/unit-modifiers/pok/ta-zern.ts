import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const TaZern: UnitModifierSchemaType = {
  name: "Ta Zern",
  description:
    "You may reroll ability dice (when active will reroll all misses)",
  owner: "self",
  priority: "adjust",
  isActiveIdle: true,
  triggers: [
    { cardClass: "commander", nsidName: "ta-zern" },
    { cardClass: "alliance", nsidName: "jolnar" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string = "card.leader.commander:pok/ta-zern";
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "antiFighterBarrage" ||
        rollType === "bombardment" ||
        rollType === "spaceCannonDefense" ||
        rollType === "spaceCannonOffense") &&
      combatRoll.isCommanderUnlocked(commanderNsid)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const antiFighterBarrage: CombatAttrs | undefined =
        unitAttrs.getAntiFighterBarrage();
      if (antiFighterBarrage) {
        antiFighterBarrage.setRerollMisses(true);
      }

      const bombardment: CombatAttrs | undefined = unitAttrs.getBombardment();
      if (bombardment) {
        bombardment.setRerollMisses(true);
      }

      const spaceCannon: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
      if (spaceCannon) {
        spaceCannon.setRerollMisses(true);
      }
    }
  },
};
