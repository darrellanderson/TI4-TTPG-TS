import { UnitAttrsSchemaType } from "../schema/unit-attrs-schema";

export const SOURCE_TO_UNIT_ATTRS_DATA: Record<
  string,
  Array<UnitAttrsSchemaType>
> = {
  base: [
    // Carrier
    {
      name: "Carrier",
      unit: "carrier",
      componentCount: 4,
      isShip: true,
      cost: 3,
      spaceCombat: { hit: 9 },
      diceColor: "#0000ff",
    },
    {
      name: "Carrier II",
      unit: "carrier",
      nsidName: "carrier-2",
    },
    {
      name: "Advanced Carrier",
      unit: "carrier",
      nsidName: "advanced-carrier",
    },
    {
      name: "Advanced Carrier II",
      unit: "carrier",
      nsidName: "advanced-carrier-2",
      hasSustainDamage: true,
    },

    // Cruiser
    {
      name: "Cruiser",
      unit: "cruiser",
      componentCount: 8,
      isShip: true,
      cost: 2,
      spaceCombat: { hit: 7 },
      diceColor: "#c080ff",
    },
    {
      name: "Cruiser II",
      unit: "cruiser",
      nsidName: "cruiser-2",
      spaceCombat: { hit: 6 },
    },

    // Destroyer
    {
      name: "Destroyer",
      unit: "destroyer",
      componentCount: 8,
      isShip: true,
      cost: 1,
      antiFighterBarrage: { dice: 2, hit: 9 },
      spaceCombat: { hit: 9 },
      diceColor: "#ff0000",
    },
    {
      name: "Destroyer II",
      unit: "destroyer",
      nsidName: "destroyer-2",
      antiFighterBarrage: { dice: 3, hit: 6 },
      spaceCombat: { hit: 8 },
    },

    // Dreadnought
    {
      name: "Dreadnought",
      unit: "dreadnought",
      componentCount: 5,
      isShip: true,
      cost: 4,
      hasSustainDamage: true,
      bombardment: { hit: 5 },
      spaceCombat: { hit: 5 },
      diceColor: "#804080",
    },
    {
      name: "Dreadnought II",
      unit: "dreadnought",
      nsidName: "dreadnought-2",
    },
    {
      name: "Exotrireme",
      unit: "dreadnought",
      nsidName: "exotrireme",
      bombardment: { dice: 2, hit: 4 },
    },
    {
      name: "Exotrireme II",
      unit: "dreadnought",
      nsidName: "exotrireme-2",
      bombardment: { dice: 2, hit: 4 },
    },
    {
      name: "Super Dreadnought",
      unit: "dreadnought",
      nsidName: "super-dreadnought",
    },
    {
      name: "Super Dreadnought II",
      unit: "dreadnought",
      nsidName: "super-dreadnought-2",
      bombardment: { hit: 4 },
      spaceCombat: { hit: 4 },
    },

    // Fighter
    {
      name: "Fighter",
      unit: "fighter",
      componentCount: 10,
      isShip: true,
      cost: 1,
      producePerCost: 2,
      spaceCombat: { hit: 9 },
      diceColor: "#00ffff",
    },
    {
      name: "Fighter II",
      unit: "fighter",
      nsidName: "fighter-2",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Hybrid Crystal Fighter",
      unit: "fighter",
      nsidName: "hybrid-crystal-fighter",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Hybrid Crystal Fighter II",
      unit: "fighter",
      nsidName: "hybrid-crystal-fighter-2",
      spaceCombat: { hit: 7 },
    },

    // Flagship
    {
      name: "Flagship",
      unit: "flagship",
      componentCount: 1,
      cost: 8,
      hasSustainDamage: true,
      isShip: true,
      diceColor: "#000000",
      spaceCombat: { dice: 2, hit: 7 }, // often overridded
    },
    {
      name: "[0.0.1]", // L1Z1X
      unit: "flagship",
      nsidName: "001",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Arc Secundus", // Letnev
      unit: "flagship",
      nsidName: "arc-secundus",
      disablePlanetaryShield: true,
      bombardment: { dice: 3, hit: 5 },
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "C'morran N'orr", // Sardakk
      unit: "flagship",
      nsidName: "cmorran-norr",
      spaceCombat: { dice: 2, hit: 6 },
    },
    {
      name: "Duha Menaimon", // Arborec
      unit: "flagship",
      nsidName: "duha-menaimon",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Fourth Moon", // Mentak
      unit: "flagship",
      nsidName: "fourth-moon",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Genesis", // Sol
      unit: "flagship",
      nsidName: "genesis",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Hil Colish", // Creuss
      unit: "flagship",
      nsidName: "hil-colish",
      spaceCombat: { dice: 1, hit: 5 },
    },
    {
      name: "J.N.S. Hylarim", // Jol-Nar
      unit: "flagship",
      nsidName: "jns-hylarim",
      spaceCombat: { dice: 2, hit: 6, crit: 9, critCount: 2 },
    },
    {
      name: "Loncara Ssodu", // Xxcha
      unit: "flagship",
      nsidName: "loncara-ssodu",
      spaceCannon: { dice: 3, hit: 5, range: 1 },
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Matriarch", // Naalu
      unit: "flagship",
      nsidName: "matriarch",
      spaceCombat: { dice: 2, hit: 9 },
    },
    {
      name: "Salai Sai Corian", // Winnu
      unit: "flagship",
      nsidName: "salai-sai-corian",
      spaceCombat: { dice: 1, hit: 7 },
    },
    {
      name: "Son of Ragh", // Saar
      unit: "flagship",
      nsidName: "son-of-ragh",
      antiFighterBarrage: { dice: 2, hit: 6 },
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "The Alastor", // Nekro
      unit: "flagship",
      nsidName: "the-alastor",
      spaceCombat: { dice: 2, hit: 9 },
    },
    {
      name: "The Inferno", // Muaat
      unit: "flagship",
      nsidName: "the-inferno",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Van Hauge", // Yin
      unit: "flagship",
      nsidName: "van-hauge",
      spaceCombat: { dice: 2, hit: 9 },
    },
    {
      name: "Wrath of Kenara", // Hacan
      unit: "flagship",
      nsidName: "wrath-of-kenara",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Ysia Yssrila", // Yssaril
      unit: "flagship",
      nsidName: "ysia-yssrila",
      spaceCombat: { dice: 2, hit: 5 },
    },

    // Infantry
    {
      name: "Infantry",
      unit: "infantry",
      componentCount: 12,
      isGround: true,
      cost: 1,
      producePerCost: 2,
      groundCombat: { hit: 8 },
      diceColor: "#00ff00",
    },
    {
      name: "Infantry II",
      unit: "infantry",
      nsidName: "infantry-2",
      groundCombat: { hit: 7 },
    },
    {
      name: "Letani Warrior",
      unit: "infantry",
      nsidName: "letani-warrior",
    },
    {
      name: "Letani Warrior II",
      unit: "infantry",
      nsidName: "letani-warrior-2",
      groundCombat: { hit: 7 },
    },
    {
      name: "Spec Ops",
      unit: "infantry",
      nsidName: "spec-ops",
      groundCombat: { hit: 7 },
    },
    {
      name: "Spec Ops II",
      unit: "infantry",
      nsidName: "spec-ops-2",
      groundCombat: { hit: 6 },
    },

    // PDS
    {
      name: "PDS",
      unit: "pds",
      componentCount: 6,
      hasPlanetaryShield: true,
      spaceCannon: { hit: 6 },
      diceColor: "#ff8000",
    },
    {
      name: "PDS II",
      unit: "pds",
      nsidName: "pds-2",
      spaceCannon: { hit: 5, range: 1 },
    },

    // Space dock
    {
      name: "Space Dock",
      unit: "space-dock",
      componentCount: 3,
      diceColor: "#ffff00",
    },
    {
      name: "Space Dock II",
      unit: "space-dock",
      nsidName: "space-dock-2",
    },
    {
      name: "Floating Factory",
      unit: "space-dock",
      nsidName: "floating-factory",
    },
    {
      name: "Floating Factory II",
      unit: "space-dock",
      nsidName: "floating-factory-2",
    },

    // War sun
    {
      name: "War Sun",
      unit: "war-sun",
      componentCount: 2,
      isShip: true,
      hasSustainDamage: true,
      disablePlanetaryShield: true,
      bombardment: { dice: 3, hit: 3 },
      spaceCombat: { dice: 3, hit: 3 },
      diceColor: "#ff8000",
    },
    {
      name: "War Sun",
      unit: "war-sun",
      nsidName: "war-sun-2", // must have -2 suffix to be tech card
      cost: 12,
    },
    {
      name: "Prototype War Sun",
      unit: "war-sun",
      nsidName: "prototype-war-sun",
      cost: 12,
    },
    {
      name: "Prototype War Sun II",
      unit: "war-sun",
      nsidName: "prototype-war-sun-2",
      cost: 10,
    },
  ],

  "codex.ordinian": [
    {
      name: "[Redacted]",
      unit: "destroyer",
      nsidName: "redacted",
      spaceCombat: { dice: 3, hit: 6 },
      afbDestroyInfantryInSpace: 9,
    },
  ],

  "codex.vigil": [
    {
      name: "Artemiris", // Keleres
      unit: "flagship",
      nsidName: "artemiris",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Omniopiares",
      unit: "mech",
      nsidName: "omniopiares",
    },
  ],

  pok: [
    // Cruiser
    {
      name: "Saturn Engine",
      unit: "cruiser",
      nsidName: "saturn-engine",
    },
    {
      name: "Saturn Engine II",
      unit: "cruiser",
      nsidName: "saturn-engine-2",
      spaceCombat: { hit: 6 },
    },

    // Destroyer
    {
      name: "String Wing Alpha",
      unit: "destroyer",
      nsidName: "strike-wing-alpha",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Strike Wing Alpha II",
      unit: "destroyer",
      nsidName: "strike-wing-alpha-2",
      antiFighterBarrage: { dice: 3, hit: 6 },
      spaceCombat: { hit: 7 },
      afbDestroyInfantryInSpace: 9,
    },

    // Flagship
    {
      name: "Arvicon Rex", // Mahact
      unit: "flagship",
      nsidName: "arvicon-rex",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Dynamo", // Empyrean
      unit: "flagship",
      nsidName: "dynamo",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Memoria I", // Nomad
      unit: "flagship",
      nsidName: "memoria",
      antiFighterBarrage: { dice: 3, hit: 8 },
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Memoria II", // Nomad (upgraded)
      unit: "flagship",
      nsidName: "memoria-2",
      antiFighterBarrage: { dice: 3, hit: 5 },
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Ouranos", // Ul
      unit: "flagship",
      nsidName: "ouranos",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Quetzecoatl", // Argent
      unit: "flagship",
      nsidName: "quetzecoatl",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "The Terror Between", // Vuilraith
      unit: "flagship",
      nsidName: "the-terror-between",
      bombardment: { hit: 5 },
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Visz El Vir", // Naaz-Rokha
      unit: "flagship",
      nsidName: "visz-el-vir",
      spaceCombat: { dice: 2, hit: 9 },
    },

    // Infantry
    {
      name: "Crimsom Legionnaire",
      unit: "infantry",
      nsidName: "crimson-legionnaire",
    },
    {
      name: "Crimsom Legionnaire II",
      unit: "infantry",
      nsidName: "crimson-legionnaire-2",
      groundCombat: { hit: 7 },
    },

    // Mech
    {
      name: "Mech",
      unit: "mech",
      componentCount: 4,
      cost: 2,
      hasSustainDamage: true,
      isGround: true,
      groundCombat: { hit: 6 },
    },
    {
      name: "Aerie Sentinel",
      unit: "mech",
      nsidName: "aerie-sentinel",
    },
    {
      name: "Annihilator",
      unit: "mech",
      nsidName: "annihilator",
      bombardment: { hit: 8 },
    },
    {
      name: "Blackshade Infiltrator",
      unit: "mech",
      nsidName: "blackshade-infiltrator",
    },
    {
      name: "Dunlain Reaper",
      unit: "mech",
      nsidName: "dunlain-reaper",
    },
    {
      name: "Eidolon",
      unit: "mech",
      nsidName: "eidolon",
      spaceCombat: { dice: 2, hit: 8 },
      groundCombat: { dice: 2, hit: 6 },
    },
    {
      name: "Ember Colossus",
      unit: "mech",
      nsidName: "ember-colossus",
    },
    {
      name: "Hecatoncheires",
      unit: "mech",
      nsidName: "hecatoncheires",
    },
    {
      name: "Icarus Drive",
      unit: "mech",
      nsidName: "icarus-drive",
    },
    {
      name: "Iconoclast",
      unit: "mech",
      nsidName: "iconoclast",
    },
    {
      name: "Indomitus",
      unit: "mech",
      nsidName: "indomitus",
      spaceCannon: { hit: 8, range: 1 },
    },
    {
      name: "Letani Behemoth",
      unit: "mech",
      nsidName: "letani-behemoth",
      hasPlanetaryShield: true,
    },
    {
      name: "Moll Terminus",
      unit: "mech",
      nsidName: "moll-terminus",
    },
    {
      name: "Mordred",
      unit: "mech",
      nsidName: "mordred",
    },
    {
      name: "Moyins Ashes",
      unit: "mech",
      nsidName: "moyins-ashes",
    },
    {
      name: "Pride of Kenara",
      unit: "mech",
      nsidName: "pride-of-kenara",
    },
    {
      name: "Quantum Manipulator",
      unit: "mech",
      nsidName: "quantum-manipulator",
    },
    {
      name: "Reanimator",
      unit: "mech",
      nsidName: "reanimator",
    },
    {
      name: "Reclaimer",
      unit: "mech",
      nsidName: "reclaimer",
    },
    {
      name: "Scavenger Zeta",
      unit: "mech",
      nsidName: "scavenger-zeta",
    },
    {
      name: "Shield Paling",
      unit: "mech",
      nsidName: "shield-paling",
    },
    {
      name: "Starlancer",
      unit: "mech",
      nsidName: "starlancer",
    },
    {
      name: "Valkyrie Exoskeleton",
      unit: "mech",
      nsidName: "valkyrie-exoskeleton",
    },
    {
      name: "Watcher",
      unit: "mech",
      nsidName: "watcher",
    },
    {
      name: "Zs Thunderbolt M2",
      unit: "mech",
      nsidName: "zs-thunderbolt-m2",
    },

    // PDS
    {
      name: "Hel Titan",
      unit: "pds",
      nsidName: "hel-titan",
      groundCombat: { hit: 7 },
      hasSustainDamage: true,
    },
    {
      name: "Hel Titan II",
      unit: "pds",
      nsidName: "hel-titan-2",
      spaceCannon: { hit: 5, range: 1 },
      groundCombat: { hit: 6 },
      hasSustainDamage: true,
    },

    // Space dock
    {
      name: "Dimensional Tear",
      unit: "space-dock",
      nsidName: "dimensional-tear",
    },
    {
      name: "Dimensional Tear II",
      unit: "space-dock",
      nsidName: "dimensional-tear-2",
    },
  ],

  "thunders-edge": [
    {
      name: "4x41c Helios V1",
      unit: "space-dock",
      nsidName: "4x41c-helios-v1",
    },
    {
      name: "4x41c Helios V2",
      unit: "destroyer",
      nsidName: "4x41c-helios-v2",
    },
    {
      name: "Exile",
      unit: "destroyer",
      nsidName: "exile",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Exile 2",
      unit: "destroyer",
      nsidName: "exile-2",
      antiFighterBarrage: { hit: 6, dice: 3 },
      spaceCombat: { hit: 7 },
    },
    {
      name: "Linkship",
      unit: "destroyer",
      nsidName: "linkship",
    },
    {
      name: "Linkship II",
      unit: "destroyer",
      nsidName: "linkship-2",
      antiFighterBarrage: { hit: 6, dice: 3 },
      spaceCombat: { hit: 8 },
    },
    {
      name: "The Egeiro",
      unit: "flagship",
      nsidName: "the-egeiro",
      spaceCombat: { hit: 9, dice: 1 },
    },
    {
      name: "D.W.S. Luminous",
      unit: "flagship",
      nsidName: "dws-luminous",
      spaceCombat: { hit: 7, dice: 2 },
    },
    {
      name: "Heaven's Eye",
      unit: "flagship",
      nsidName: "heavens-eye",
      spaceCombat: { hit: 5, dice: 2 },
    },
    {
      name: "Heaven's Hollow",
      unit: "flagship",
      nsidName: "heavens-hollow",
      spaceCombat: { hit: 5, dice: 3 },
    },
    {
      name: "Last Dispatch",
      unit: "flagship",
      nsidName: "last-dispatch",
      spaceCombat: { hit: 8, dice: 2 },
    },
    {
      name: "Quietus",
      unit: "flagship",
      nsidName: "quietus",
      spaceCombat: { hit: 5, dice: 2 },
    },
    {
      name: "Eidolon Maximus",
      unit: "mech",
      nsidName: "eidolon-maximus",
      overrideNsid: "card.breakthrough:thunders-edge/absolute-synergy",
      onlyIfFaceDown: true,
      isShip: true,
      isGround: true,
      spaceCombat: { hit: 4, dice: 4 },
      groundCombat: { hit: 4, dice: 4 },
    },
    {
      name: "Corsair",
      unit: "cruiser",
      nsidName: "corsair",
      overrideNsid: "card.breakthrough:thunders-edge/the-tables-grace",
      onlyIfFaceDown: true,
      spaceCombat: { hit: 6 },
    },
  ],
  "twilights-fall": [
    {
      name: "tf-warsun",
      nsidName: "tf-warsun",
      unit: "war-sun",
      spaceCombat: { dice: 2, hit: 5 },
      bombardment: { dice: 3, hit: 5 },
    },
    {
      name: "A Strangled Whisper",
      nsidName: "a-strangled-whisper",
      unit: "flagship",
      bombardment: { dice: 1, hit: 7 },
    },
    {
      name: "Bone Picked Clean",
      nsidName: "bone-picked-clean",
      overrideNsid: "unit:twilights-fall/bone-picked-clean",
      unit: "mech",
      groundCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Tizona",
      nsidName: "tizona",
      unit: "flagship",
      spaceCombat: { dice: 1, hit: 3 },
    },
    {
      name: "Colada",
      nsidName: "colada",
      overrideNsid: "unit:twilights-fall/colada",
      unit: "mech",
    },
    {
      name: "Nightbloom",
      nsidName: "nightbloom",
      unit: "flagship",
    },
    {
      name: "Lakoe's Roots",
      nsidName: "lakoes-roots",
      overrideNsid: "unit:twilights-fall/lakoes-roots",
      unit: "mech",
    },
    {
      name: "Airo Shir Rex",
      nsidName: "airo-shir-rex",
      unit: "flagship",
    },
    {
      name: "Starlancer II",
      nsidName: "starlancer-ii",
      overrideNsid: "unit:twilights-fall/starlancer-ii",
      unit: "mech",
      hasPlanetaryShield: true,
    },
    {
      name: "The Faces of Janovet",
      nsidName: "the-faces-of-janovet",
      unit: "flagship",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Analyzer",
      nsidName: "analyzer",
      overrideNsid: "unit:twilights-fall/analyzer",
      unit: "mech",
    },
    {
      name: "Enigma",
      nsidName: "enigma",
      unit: "flagship",
      spaceCombat: { dice: 1, hit: 7 },
    },
    {
      name: "Starlancer XI",
      nsidName: "starlancer-xi",
      overrideNsid: "unit:twilights-fall/starlancer-xi",
      unit: "mech",
    },
    {
      name: "The Scarlet Knife",
      nsidName: "the-scarlet-knife",
      unit: "flagship",
      bombardment: { dice: 2, hit: 5 },
    },
    {
      name: "The Sharpened Edge",
      nsidName: "the-sharpened-edge",
      overrideNsid: "unit:twilights-fall/the-sharpened-edge",
      unit: "mech",
    },
    {
      name: "Scintillia",
      nsidName: "scintillia",
      unit: "flagship",
      spaceCombat: { dice: 2, hit: 9 },
    },
    {
      name: "Delver",
      nsidName: "delver",
      overrideNsid: "unit:twilights-fall/delver",
      unit: "mech",
    },
    // tf-unit-upgrade cards
    {
      name: "Advanced Carrier",
      nsidName: "advanced-carrier",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/advanced-carrier",
      unit: "carrier",
      hasSustainDamage: true,
    },
    {
      name: "Ahk Syl Fier",
      nsidName: "ahk-syl-fier",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/ahk-syl-fier",
      unit: "cruiser",
      spaceCombat: { dice: 1, hit: 6 },
    },
    {
      name: "Ambassador",
      nsidName: "ambassador",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/ambassador",
      unit: "carrier",
    },
    {
      name: "Corsair",
      nsidName: "corsair",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/corsair",
      unit: "cruiser",
      spaceCombat: { dice: 1, hit: 6 },
    },
    {
      name: "Dawncrusher",
      nsidName: "dawncrusher",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/dawncrusher",
      unit: "dreadnought",
      bombardment: { dice: 1, hit: 4 },
    },
    {
      name: "Exile",
      nsidName: "exile",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/exile",
      unit: "destroyer",
      antiFighterBarrage: { dice: 3, hit: 6 },
      spaceCombat: { dice: 1, hit: 8 },
    },
    {
      name: "Exotrireme",
      nsidName: "exotrireme",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/exotrireme",
      unit: "dreadnought",
      bombardment: { dice: 2, hit: 4 },
      spaceCombat: { dice: 1, hit: 4 },
    },
    {
      name: "Guild Agents",
      nsidName: "guild-agents",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/guild-agents",
      unit: "infantry",
      groundCombat: { dice: 1, hit: 7 },
    },
    {
      name: "Hel-Titan",
      nsidName: "hel-titan",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/hel-titan",
      unit: "pds",
      hasPlanetaryShield: true,
      hasSustainDamage: true,
      spaceCannon: { dice: 1, hit: 5, range: 1 },
      groundCombat: { dice: 1, hit: 5 },
    },
    {
      name: "Hybrid Crystal Fighter",
      nsidName: "hybrid-crystal-fighter",
      overrideNsid:
        "card.tf-unit-upgrade:twilights-fall/hybrid-crystal-fighter",
      unit: "fighter",
      spaceCombat: { dice: 1, hit: 7 },
    },
    {
      name: "Justicier Rail",
      nsidName: "justicier-rail",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/justicier-rail",
      unit: "pds",
      hasPlanetaryShield: true,
      spaceCannon: { dice: 1, hit: 5, range: 1 },
    },
    {
      name: "Keeper Matrix",
      nsidName: "keeper-matrix",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/keeper-matrix",
      unit: "pds",
      hasPlanetaryShield: true,
      spaceCannon: { dice: 2, hit: 5, range: 1 },
    },
    {
      name: "Letani Warrior",
      nsidName: "letani-warrior",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/letani-warrior",
      unit: "infantry",
      groundCombat: { dice: 1, hit: 7 },
    },
    {
      name: "Linkship",
      nsidName: "linkship",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/linkship",
      unit: "destroyer",
      antiFighterBarrage: { dice: 3, hit: 6 },
      spaceCombat: { dice: 1, hit: 8 },
    },
    {
      name: "Morphwing",
      nsidName: "morphwing",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/morphwing",
      unit: "fighter",
      spaceCombat: { dice: 1, hit: 7 },
      groundCombat: { dice: 1, hit: 7 },
      isGround: true,
    },
    {
      name: "Prototype War Sun",
      nsidName: "prototype-war-sun",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/prototype-war-sun",
      unit: "war-sun",
      bombardment: { dice: 3, hit: 3 },
      spaceCombat: { dice: 3, hit: 3 },
    },
    {
      name: "Saggitaria",
      nsidName: "saggitaria",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/saggitaria",
      unit: "cruiser",
      hasSustainDamage: true,
      spaceCombat: { dice: 1, hit: 6 },
    },
    {
      name: "Strike Wing Alpha",
      nsidName: "strike-wing-alpha",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/strike-wing-alpha",
      unit: "destroyer",
      antiFighterBarrage: { dice: 3, hit: 6 },
      spaceCombat: { dice: 1, hit: 7 },
      afbDestroyInfantryInSpace: 9,
    },
    {
      name: "Super Dreadnought",
      nsidName: "super-dreadnought",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/super-dreadnought",
      unit: "dreadnought",
      bombardment: { dice: 1, hit: 4 },
    },
    {
      name: "The Dragon Freed",
      nsidName: "the-dragon-freed",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/the-dragon-freed",
      unit: "war-sun",
      bombardment: { dice: 3, hit: 3 },
      spaceCombat: { dice: 3, hit: 3 },
    },
    {
      name: "Triune",
      nsidName: "triune",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/triune",
      unit: "fighter",
      spaceCombat: { dice: 1, hit: 7 },
    },
    {
      name: "University War Sun",
      nsidName: "university-war-sun",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/university-war-sun",
      unit: "war-sun",
      spaceCombat: { dice: 3, hit: 4 },
      bombardment: { dice: 3, hit: 4 },
    },
    {
      name: "Vortexer",
      nsidName: "vortexer",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/vortexer",
      unit: "carrier",
    },
    {
      name: "Yin Clone",
      nsidName: "yin-clone",
      overrideNsid: "card.tf-unit-upgrade:twilights-fall/yin-clone",
      unit: "infantry",
      groundCombat: { dice: 1, hit: 7 },
    },
  ],
};
