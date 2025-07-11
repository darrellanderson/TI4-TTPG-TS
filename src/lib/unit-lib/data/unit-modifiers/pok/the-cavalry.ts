import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../../schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

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
      TI4.unitAttrsRegistry.rawByNsid("unit:pok/memoria");
    const memoria2: UnitAttrsSchemaType | undefined =
      TI4.unitAttrsRegistry.rawByNsid(
        "card.technology.unit-upgrade:pok/memoria-2"
      );

    if (memoria1 && memoria2) {
      let name: string = "The Cavalry";
      let memoriaWhich: UnitAttrsSchemaType = memoria1;
      const memoria2Nsid = UnitAttrs.schemaToNsid("pok", memoria2);
      if (combatRoll.find.findCard(memoria2Nsid) !== undefined) {
        name = "The Cavalry II";
        memoriaWhich = memoria2;
      }
      const cavalry: UnitAttrsSchemaType = {
        ...memoriaWhich,
        name,
        unit: "the-cavalry" as UnitType,
      };
      combatRoll.self.addSyntheticUnit(cavalry, 1);
    }
  },
};
