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
      spaceCombat: { hit: 4 },
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
      spaceCombat: { hit: 13 }, // placeholder, should be overridden
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
      spaceCombat: { hit: 5 },
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
      spaceCombat: { hit: 7 },
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
      diceColor: "#ff8000",
    },
    {
      name: "War Sun",
      unit: "war-sun",
      nsidName: "war-sun-2", // must have -2 suffix to be tech card
      cost: 12,
      bombardment: { dice: 3, hit: 3 },
      spaceCombat: { dice: 3, hit: 3 },
    },
    {
      name: "Prototype War Sun",
      unit: "war-sun",
      nsidName: "prototype-war-sun",
      cost: 12,
      bombardment: { dice: 3, hit: 3 },
      spaceCombat: { dice: 3, hit: 3 },
    },
    {
      name: "Prototype War Sun II",
      unit: "war-sun",
      nsidName: "prototype-war-sun-2",
      cost: 10,
      bombardment: { dice: 3, hit: 3 },
      spaceCombat: { dice: 3, hit: 3 },
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
      name: "The Egeiro",
      unit: "flagship",
      nsidName: "the-egeiro",
      spaceCombat: { hit: 9 },
    },
  ],
};
