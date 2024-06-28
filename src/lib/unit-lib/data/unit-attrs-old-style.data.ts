// Provide old version for test comparison with new.
export const OLD_STYLE_UNIT_ATTRS = [
  // Basic units.
  {
    unit: "carrier",
    unitNsid: "unit:base/carrier",
    cost: 3,
    spaceCombat: { dice: 1, hit: 9 },
    ship: true,
    unitCount: 4,
  },
  {
    unit: "cruiser",
    unitNsid: "unit:base/cruiser",
    cost: 2,
    spaceCombat: { dice: 1, hit: 7 },
    ship: true,
    unitCount: 8,
  },
  {
    unit: "destroyer",
    unitNsid: "unit:base/destroyer",
    antiFighterBarrage: { dice: 2, hit: 9 },
    cost: 1,
    spaceCombat: { dice: 1, hit: 9 },
    ship: true,
    unitCount: 8,
  },
  {
    unit: "dreadnought",
    unitNsid: "unit:base/dreadnought",
    sustainDamage: true,
    bombardment: { dice: 1, hit: 5 },
    cost: 4,
    spaceCombat: { dice: 1, hit: 5 },
    ship: true,
    unitCount: 5,
  },
  {
    unit: "fighter",
    unitNsid: "unit:base/fighter",
    cost: 1,
    produce: 2,
    spaceCombat: { dice: 1, hit: 9 },
    ship: true,
    requireCapacity: true,
    unitCount: 10,
  },
  {
    unit: "flagship",
    unitNsid: "unit:base/flagship",
    sustainDamage: true,
    cost: 8,
    ship: true,
    unitCount: 1,
  },
  {
    unit: "infantry",
    unitNsid: "unit:base/infantry",
    cost: 1,
    produce: 2,
    groundCombat: { dice: 1, hit: 8 },
    ground: true,
    requireCapacity: true,
    unitCount: 12,
  },
  {
    unit: "mech",
    unitNsid: "unit:pok/mech",
    cost: 2,
    groundCombat: { dice: 1, hit: 6 },
    sustainDamage: true,
    ground: true,
    requireCapacity: true,
    unitCount: 4,
  },
  {
    unit: "pds",
    unitNsid: "unit:base/pds",
    planetaryShield: true,
    spaceCannon: { dice: 1, hit: 6 },
    structure: true,
    unitCount: 6,
  },
  {
    unit: "space_dock",
    unitNsid: "unit:base/space_dock",
    structure: true,
    unitCount: 3,
  },
  {
    unit: "war_sun",
    unitNsid: "unit:base/war_sun",
    ship: true,
    unitCount: 2,
  },

  // Unit upgrades.
  {
    unit: "carrier",
    triggerNsid: "card.technology.unit_upgrade:base/carrier_2",
  },
  {
    unit: "cruiser",
    triggerNsid: "card.technology.unit_upgrade:base/cruiser_2",
    spaceCombat: { hit: 6 },
  },
  {
    unit: "destroyer",
    triggerNsid: "card.technology.unit_upgrade:base/destroyer_2",
    antiFighterBarrage: { dice: 3, hit: 6 },
    spaceCombat: { hit: 8 },
  },
  {
    unit: "dreadnought",
    triggerNsid: "card.technology.unit_upgrade:base/dreadnought_2",
  },
  {
    unit: "fighter",
    triggerNsid: "card.technology.unit_upgrade:base/fighter_2",
    spaceCombat: { hit: 8 },
    requireCapacity: false,
  },
  {
    unit: "infantry",
    triggerNsid: "card.technology.unit_upgrade:base/infantry_2",
    groundCombat: { hit: 7 },
  },
  {
    unit: "pds",
    triggerNsid: "card.technology.unit_upgrade:base/pds_2",
    spaceCannon: { hit: 5, range: 1 },
  },
  {
    unit: "space_dock",
    triggerNsid: "card.technology.unit_upgrade:base/space_dock_2",
  },
  {
    unit: "war_sun",
    triggerNsid: "card.technology.unit_upgrade:base/war_sun",
    disablePlanetaryShield: true,
    sustainDamage: true,
    bombardment: { dice: 3, hit: 3 },
    cost: 12,
    spaceCombat: { dice: 3, hit: 3 },
  },

  // Non-flagship faction units.
  {
    unit: "carrier",
    triggerNsid:
      "card.technology.unit_upgrade.sol:franken.base/advanced_carrier",
  },
  {
    unit: "carrier",
    triggerNsid: "card.technology.unit_upgrade.sol:base/advanced_carrier_2",
    sustainDamage: true,
  },
  {
    unit: "dreadnought",
    triggerNsid: "card.technology.unit_upgrade.norr:franken.base/exotrireme",
    bombardment: { dice: 2, hit: 4 },
  },
  {
    unit: "dreadnought",
    triggerNsid: "card.technology.unit_upgrade.norr:base/exotrireme_2",
    bombardment: { dice: 2, hit: 4 },
  },
  {
    unit: "space_dock",
    triggerNsid:
      "card.technology.unit_upgrade.saar:franken.base/floating_factory",
  },
  {
    unit: "space_dock",
    triggerNsid: "card.technology.unit_upgrade.saar:base/floating_factory_2",
  },
  {
    unit: "fighter",
    triggerNsid:
      "card.technology.unit_upgrade.naalu:franken.base/hybrid_crystal_fighter",
    spaceCombat: { hit: 8 },
  },
  {
    unit: "fighter",
    triggerNsid:
      "card.technology.unit_upgrade.naalu:base/hybrid_crystal_fighter_2",
    spaceCombat: { hit: 7 },
  },
  {
    unit: "infantry",
    triggerNsid:
      "card.technology.unit_upgrade.arborec:franken.base/letani_warrior",
  },
  {
    unit: "infantry",
    triggerNsid: "card.technology.unit_upgrade.arborec:base/letani_warrior_2",
    groundCombat: { hit: 7 },
  },
  {
    unit: "war_sun",
    triggerNsid:
      "card.technology.unit_upgrade.muaat:franken.base/prototype_war_sun",
    disablePlanetaryShield: true,
    sustainDamage: true,
    bombardment: { dice: 3, hit: 3 },
    cost: 12,
    spaceCombat: { dice: 3, hit: 3 },
  },
  {
    unit: "war_sun",
    triggerNsid: "card.technology.unit_upgrade.muaat:base/prototype_war_sun_2",
    disablePlanetaryShield: true,
    sustainDamage: true,
    bombardment: { dice: 3, hit: 3 },
    cost: 10,
    spaceCombat: { dice: 3, hit: 3 },
  },
  {
    unit: "infantry",
    triggerNsid: "card.technology.unit_upgrade.sol:franken.base/spec_ops",
    groundCombat: { hit: 7 },
  },
  {
    unit: "infantry",
    triggerNsid: "card.technology.unit_upgrade.sol:base/spec_ops_2",
    groundCombat: { hit: 6 },
  },
  {
    unit: "dreadnought",
    triggerNsid:
      "card.technology.unit_upgrade.l1z1x:franken.base/superdreadnought",
  },
  {
    unit: "dreadnought",
    triggerNsid: "card.technology.unit_upgrade.l1z1x:base/superdreadnought_2",
    bombardment: { dice: 1, hit: 4 },
    spaceCombat: { hit: 4 },
  },
  {
    unit: "destroyer",
    triggerNsid:
      "card.technology.unit_upgrade.argent:franken.pok/strike_wing_alpha",
    spaceCombat: { hit: 8 },
  },
  {
    unit: "destroyer",
    triggerNsid: "card.technology.unit_upgrade.argent:pok/strike_wing_alpha_2",
    antiFighterBarrage: { dice: 3, hit: 6, destroyInfantryInSpace: 9 },
    spaceCombat: { hit: 7 },
  },
  {
    unit: "infantry",
    triggerNsid:
      "card.technology.unit_upgrade.mahact:franken.pok/crimson_legionnaire",
    groundCombat: { hit: 8 },
  },
  {
    unit: "infantry",
    triggerNsid:
      "card.technology.unit_upgrade.mahact:pok/crimson_legionnaire_2",
    groundCombat: { hit: 7 },
  },
  {
    unit: "cruiser",
    triggerNsid: "card.technology.unit_upgrade.ul:franken.pok/saturn_engine",
    spaceCombat: { hit: 7 },
  },
  {
    unit: "cruiser",
    triggerNsid: "card.technology.unit_upgrade.ul:pok/saturn_engine_2",
    spaceCombat: { hit: 6 },
    sustainDamage: true,
  },
  {
    unit: "pds",
    triggerNsid: "card.technology.unit_upgrade.ul:franken.pok/heltitan",
    groundCombat: { hit: 7, dice: 1 },
    planetaryShield: true,
    spaceCannon: { dice: 1, hit: 6 },
    sustainDamage: true,
  },
  {
    unit: "pds",
    triggerNsid: "card.technology.unit_upgrade.ul:pok/heltitan_2",
    groundCombat: { hit: 6, dice: 1 },
    planetaryShield: true,
    spaceCannon: { dice: 1, hit: 5, range: 1 },
    sustainDamage: true,
  },
  {
    unit: "space_dock",
    triggerNsid:
      "card.technology.unit_upgrade.vuilraith:franken.pok/dimensional_tear",
  },
  {
    unit: "space_dock",
    triggerNsid:
      "card.technology.unit_upgrade.vuilraith:pok/dimensional_tear_2",
  },

  // Mech.
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.argent:pok/aerie_sentinel",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.l1z1x:base/annihilator",
    bombardment: { dice: 1, hit: 8 },
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.yssaril:base/blackshade_infiltrator",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.letnev:base/dunlain_reaper",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.naazrokha:pok/eidolon",
    spaceCombat: { dice: 2, hit: 8, requireSpace: true },
    groundCombat: { dice: 2, hit: 6, requireGround: true },
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.muaat:base/ember_colossus",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.ul:pok/hecatoncheires",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.creuss:base/icarus_drive",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.naalu:base/iconoclast",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.xxcha:base/indomitus",
    spaceCannon: { dice: 1, hit: 8, range: 1 },
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.arborec:base/letani_behemoth",
    planetaryShield: true,
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.mentak:base/moll_terminus",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.nekro:base/mordred",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.yin:base/moyins_ashes",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.keleres:codex.vigil/omniopiares",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.hacan:base/pride_of_kenara",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.nomad:pok/quantum_manipulator",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.vuilraith:pok/reanimator",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.winnu:base/reclaimer",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.saar:base/scavenger_zeta",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.jolnar:base/shield_paling",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.mahact:pok/starlancer",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.norr:base/valkyrie_exoskeleton",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.empyrean:pok/watcher",
  },
  {
    unit: "mech",
    triggerNsid: "card.leader.mech.sol:base/zs_thunderbolt_m2",
  },

  // Codex 1 (Ordinian).
  {
    unit: "destroyer",
    triggerNsid: "card.technology.unit_upgrade.nekro:codex.ordinian/redacted",
    antiFighterBarrage: { dice: 3, hit: 6, destroyInfantryInSpace: 9 },
    spaceCombat: { hit: 7 },
  },

  // Flagships.
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.l1z1x:franken.base/001",
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.letnev:franken.base/arc_secundus",
    disablePlanetaryShield: true,
    bombardment: { dice: 3, hit: 5 },
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.keleres:franken.codex.vigil/artemiris",
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.mahact:franken.pok/arvicon_rex",
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.norr:franken.base/cmorran_norr",
    spaceCombat: { dice: 2, hit: 6 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.arborec:franken.base/duha_menaimon",
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.empyrean:franken.pok/dynamo",
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.mentak:franken.base/fourth_moon",
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.sol:franken.base/genesis",
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.creuss:franken.base/hil_colish",
    spaceCombat: { dice: 1, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.jolnar:franken.base/jns_hylarim",
    spaceCombat: { dice: 2, hit: 6, extraHitsOn: { count: 2, value: 9 } },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.xxcha:franken.base/loncara_ssodu",
    spaceCannon: { dice: 3, hit: 5, range: 1 },
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.naalu:franken.base/matriarch",
    spaceCombat: { dice: 2, hit: 9 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.nomad:franken.pok/memoria",
    antiFighterBarrage: { dice: 3, hit: 8 },
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.nomad:pok/memoria_2",
    antiFighterBarrage: { dice: 3, hit: 5 },
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.ul:franken.pok/ouranos",
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.argent:franken.pok/quetzecoatl",
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.winnu:franken.base/salai_sai_corian",
    spaceCombat: { dice: 1, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.saar:franken.base/son_of_ragh",
    antiFighterBarrage: { dice: 4, hit: 6 },
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.nekro:franken.base/the_alastor",
    spaceCombat: { dice: 2, hit: 9 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.muaat:franken.base/the_inferno",
    spaceCombat: { dice: 2, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.vuilraith:franken.pok/the_terror_between",
    spaceCombat: { dice: 2, hit: 5 },
    bombardment: { dice: 1, hit: 5 },
  },
  {
    unit: "flagship",
    triggerNsid: "card.technology.unit_upgrade.yin:franken.base/van_hauge",
    spaceCombat: { dice: 2, hit: 9 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.naazrokha:franken.pok/visz_el_vir",
    spaceCombat: { dice: 2, hit: 9 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.hacan:franken.base/wrath_of_kenara",
    spaceCombat: { dice: 2, hit: 7 },
  },
  {
    unit: "flagship",
    triggerNsid:
      "card.technology.unit_upgrade.yssaril:franken.base/ysia_yssrila",
    spaceCombat: { dice: 2, hit: 5 },
  },
];
