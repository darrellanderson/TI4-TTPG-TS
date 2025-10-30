import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";

export const TacticalBrilliance: UnitModifierSchemaType = {
  name: "Tactical Brilliance",
  description:
    "You may reroll ability dice (when active will reroll all misses)",
  owner: "self",
  priority: "choose",
  triggers: [{ cardClass: "tf-ability", nsidName: "tactical-brilliance" }],
  isActiveIdle: true,
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "antiFighterBarrage" ||
      rollType === "bombardment" ||
      rollType === "spaceCannonDefense" ||
      rollType === "spaceCannonOffense"
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
