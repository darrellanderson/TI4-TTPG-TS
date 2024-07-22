import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitType } from "../../../schema/unit-attrs-schema";

export const SalaiSaiCorian: UnitModifierSchemaType = {
  name: "Salai Sai Corian",
  description:
    "Rolls number of dice equal to number of opponent's non-fighter ships",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "flagship", nsidName: "salai-sai-corian" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" && combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    let opponentNonFighterShips: number = 0;
    for (const unitAttrs of combatRoll.opponent.unitAttrsSet.getAll()) {
      const unit: UnitType = unitAttrs.getUnit();
      if (unitAttrs.isShip() && unit !== "fighter") {
        opponentNonFighterShips += combatRoll.opponent.getCount(unit);
      }
    }
    const flagship: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("flagship");
    if (flagship) {
      const spaceCombat: CombatAttrs | undefined = flagship.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.setDice(opponentNonFighterShips);
      }
    }
  },
};
