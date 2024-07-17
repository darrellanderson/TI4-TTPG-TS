import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";

export const SOURCE_TO_UNIT_MODIFIER_DATA: Record<
  string,
  Array<UnitModifierSchemaType>
> = {};
function add(source: string, modifier: UnitModifierSchemaType) {
  let modifiers: Array<UnitModifierSchemaType> | undefined =
    SOURCE_TO_UNIT_MODIFIER_DATA[source];
  if (!modifiers) {
    modifiers = [];
    SOURCE_TO_UNIT_MODIFIER_DATA[source] = modifiers;
  }
  modifiers.push(modifier);
}

import { AntimassDeflectors } from "./unit-modifiers/base/antimass-deflectors";
add("base", AntimassDeflectors);

import { _2ram } from "./unit-modifiers/pok/2ram";
add("pok", _2ram);

import { Annihilator } from "./unit-modifiers/pok/annihilator";
add("pok", Annihilator);

import { ArticlesOfWar } from "./unit-modifiers/pok/articles-of-war";
add("pok", ArticlesOfWar);

import { ArviconRex } from "./unit-modifiers/pok/arvicon-rex";
add("pok", ArviconRex);
