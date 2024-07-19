import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitAttrsSchemaType } from "../../../schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { Find } from "ttpg-darrell";

export const TheCavalry: UnitModifierSchemaType = {
  name: "The Cavalry",
  description:
    "One non-fighter ship gains the SUSTAIN DAMAGE, combat value, and ANTI-FIGHTER BARRAGE of the Nomad flagship (this modifier adds a new unit for AFB/space combat, remove the affected unit from normal setup)",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "promissory", nsidName: "the-cavalry" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "antiFighterBarrage" || rollType === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const memoria1: UnitAttrsSchemaType | undefined =
      TI4.unitAttrsRegistry.rawByNsidName("flagship:pok/memoria");
    const memoria2: UnitAttrsSchemaType | undefined =
      TI4.unitAttrsRegistry.rawByNsidName(
        "card.technology.unit-upgrade:pok/memoria-2"
      );

    console.log("memoria", memoria1 !== undefined, memoria2 !== undefined);

    if (memoria1 && memoria2) {
      let memoriaWhich: UnitAttrsSchemaType = memoria1;
      const memoria2Nsid = UnitAttrs.schemaToNsid("pok", memoria2);
      if (new Find().findCard(memoria2Nsid) !== undefined) {
        memoriaWhich = memoria2;
      }
      const cavalry: UnitAttrsSchemaType = {
        ...memoriaWhich,
        name: "The Cavalry",
        nsidName: "the-cavalry",
      };
      combatRoll.self.addSyntheticUnit(cavalry, 1);
    }
  },
};
