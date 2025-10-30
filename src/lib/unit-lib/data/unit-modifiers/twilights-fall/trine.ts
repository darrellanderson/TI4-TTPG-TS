import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const Trine: UnitModifierSchemaType = {
  name: "Trine",
  description: "SPACE CANNON up to 2 systems away fire (not yet automated)",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "tf-action", nsidName: "trine" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCannonOffense";
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (unitAttrs) {
      const spaceCannon: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
      // TODO XXX
    }
  },
};
