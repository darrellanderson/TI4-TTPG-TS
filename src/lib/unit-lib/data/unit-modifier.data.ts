import {
  CombatRoll,
  CombatRollType,
} from "lib/combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";
import { CombatAttrs } from "../unit-attrs/combat-attrs";

export const SOURCE_TO_UNIT_MODIFIER_DATA: Record<
  string,
  Array<UnitModifierSchemaType>
> = {};
function add(x: Record<string, Array<UnitModifierSchemaType>>) {
  for (const [source, unitModifierData] of Object.entries(x)) {
    let modifiers: Array<UnitModifierSchemaType> | undefined =
      SOURCE_TO_UNIT_MODIFIER_DATA[source];
    if (!modifiers) {
      modifiers = [];
      SOURCE_TO_UNIT_MODIFIER_DATA[source] = modifiers;
    }
    modifiers.push(...unitModifierData);
  }
}

import { SOURCE_TO_UNIT_MODIFIER_DATA as _2ram } from "./unit-modifiers/2ram";
add(_2ram);

import { SOURCE_TO_UNIT_MODIFIER_DATA as annihilator } from "./unit-modifiers/annihilator";
add(annihilator);

import { SOURCE_TO_UNIT_MODIFIER_DATA as antimassDeflectors } from "./unit-modifiers/antimass-deflectors";
add(antimassDeflectors);
