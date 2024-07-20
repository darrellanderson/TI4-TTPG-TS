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

import { Bunker } from "./unit-modifiers/base/bunker";
add("base", Bunker);

import { _2ram } from "./unit-modifiers/pok/2ram";
add("pok", _2ram);

import { Annihilator } from "./unit-modifiers/pok/annihilator";
add("pok", Annihilator);

import { ArticlesOfWar } from "./unit-modifiers/pok/articles-of-war";
add("pok", ArticlesOfWar);

import { ArviconRex } from "./unit-modifiers/pok/arvicon-rex";
add("pok", ArviconRex);

import { BrotherOmar } from "./unit-modifiers/pok/brother-omar";
add("pok", BrotherOmar);

import { EmissaryTaivra } from "./unit-modifiers/pok/emissary-taivra";
add("pok", EmissaryTaivra);

import { EvelynDelouis } from "./unit-modifiers/pok/evelyn-delouis";
add("pok", EvelynDelouis);

import { Maban } from "./unit-modifiers/pok/maban";
add("pok", Maban);

import { NavarchFeng } from "./unit-modifiers/pok/navarch-feng";
add("pok", NavarchFeng);

import { RickarRickani } from "./unit-modifiers/pok/rickar-rickani";
add("pok", RickarRickani);

import { StrikeWingAbuscade } from "./unit-modifiers/pok/strike-wing-ambuscade";
add("pok", StrikeWingAbuscade);

import { Supercharge } from "./unit-modifiers/pok/supercharge";
add("pok", Supercharge);

import { TaZern } from "./unit-modifiers/pok/ta-zern";
add("pok", TaZern);

import { ThatWhichMoldsFlesh } from "./unit-modifiers/pok/that-which-molds-flesh";
add("pok", ThatWhichMoldsFlesh);

import { TheCavalry } from "./unit-modifiers/pok/the-cavalry";
add("pok", TheCavalry);

import { TheCrownOfThalnos } from "./unit-modifiers/pok/the-crown-of-thalnos";
add("pok", TheCrownOfThalnos);
