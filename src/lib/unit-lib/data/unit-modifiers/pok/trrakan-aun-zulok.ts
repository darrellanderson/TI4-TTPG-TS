import {
  BestUnitWithCombatAttrs,
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const TrrakanAunZulok: UnitModifierSchemaType = {
  name: "Trrakan Aun Zulok",
  description:
    "+1 die to a unit ability (anti-fighter barrage, bombardment, space cannon)",
  owner: "self",
  priority: "choose",
  isActiveIdle: true,
  triggers: [
    {
      cardClass: "commander",
      nsidName: "trrakan-aun-zulok",
    },
    { cardClass: "alliance", nsidName: "argent" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commandersNsid: string =
      "card.leader.commander:pok/trrakan-aun-zulok";

    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "antiFighterBarrage" ||
        rollType === "bombardment" ||
        rollType === "spaceCannonDefense" ||
        rollType === "spaceCannonOffense") &&
      combatRoll.isCommanderUnlocked(commandersNsid)
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const bestUnitWithCombatAttrs: BestUnitWithCombatAttrs | undefined =
      combatRoll.bestHitUnitWithCombatAttrs();
    if (bestUnitWithCombatAttrs) {
      bestUnitWithCombatAttrs.combatAttrs.addExtraDice(1);
    }
  },
};
