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

import { CmorranNorr } from "./unit-modifiers/base/cmorran-norr";
add("base", CmorranNorr);

import { FourthMoon } from "./unit-modifiers/base/fourth-moon";
add("base", FourthMoon);

import { Matriarch } from "./unit-modifiers/base/matriarch";
add("base", Matriarch);

import { NebulaDefense } from "./unit-modifiers/base/nebula-defense";
add("base", NebulaDefense);

import { PlasmaScoring } from "./unit-modifiers/base/plasma-scoring";
add("base", PlasmaScoring);

import { ProphecyOfIxth } from "./unit-modifiers/base/prophecy-of-ixth";
add("base", ProphecyOfIxth);

import { PublicizeWeaponSchematics } from "./unit-modifiers/base/publicize-weapon-schematics";
add("base", PublicizeWeaponSchematics);

import { RegulatedConscription } from "./unit-modifiers/base/regulated-conscription";
add("base", RegulatedConscription);

import { SalaiSaiCorian } from "./unit-modifiers/base/salai-sai-corian";
add("base", SalaiSaiCorian);

import { TekklarLegion } from "./unit-modifiers/base/tekklar-legion";
add("base", TekklarLegion);

import { TheAlastor } from "./unit-modifiers/base/the-alastor";
add("base", TheAlastor);

import { Unrelenting } from "./unit-modifiers/base/unrelenting";
add("base", Unrelenting);

import { Blitz } from "./unit-modifiers/codex-ordinian/blitz";
add("codex.ordinian", Blitz);

import { CustodiaVigilia } from "./unit-modifiers/codex-vigil/custodia-vigilia";
add("codex.vigil", CustodiaVigilia);

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

import { Eidolon } from "./unit-modifiers/pok/eidolon";
add("pok", Eidolon);

import { EmissaryTaivra } from "./unit-modifiers/pok/emissary-taivra";
add("pok", EmissaryTaivra);

import { EvelynDelouis } from "./unit-modifiers/pok/evelyn-delouis";
add("pok", EvelynDelouis);

import { Iconoclast } from "./unit-modifiers/pok/iconoclast";
add("pok", Iconoclast);

import { Maban } from "./unit-modifiers/pok/maban";
add("pok", Maban);

import { MollTerminus } from "./unit-modifiers/pok/moll-terminus";
add("pok", MollTerminus);

import { Mordred } from "./unit-modifiers/pok/mordred";
add("pok", Mordred);

import { NavarchFeng } from "./unit-modifiers/pok/navarch-feng";
add("pok", NavarchFeng);

import { Quetzecoatl } from "./unit-modifiers/pok/quetzecoatl";
add("pok", Quetzecoatl);

import { RickarRickani } from "./unit-modifiers/pok/rickar-rickani";
add("pok", RickarRickani);

import { ShieldPaling } from "./unit-modifiers/pok/shield-paling";
add("pok", ShieldPaling);

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

import { TrrakanAunZulok } from "./unit-modifiers/pok/trrakan-aun-zulok";
add("pok", TrrakanAunZulok);

import { UlTheProgenitor } from "./unit-modifiers/pok/ul-the-progenitor";
add("pok", UlTheProgenitor);

import { ViscountUnlenn } from "./unit-modifiers/pok/viscount-unlenn";
add("pok", ViscountUnlenn);

import { ViszElVir } from "./unit-modifiers/pok/visz-el-vir";
add("pok", ViszElVir);
