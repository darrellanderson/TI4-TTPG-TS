import { SystemSchemaType } from "../schema/system-schema";

export const SOURCE_TO_SYSTEM_DATA: Record<string, Array<SystemSchemaType>> = {
  base: [
    {
      tile: 1,
      isHome: true,
      planets: [
        {
          name: "Jord",
          nsidName: "jord",
          resources: 4,
          influence: 2,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_001.png",
    },
    {
      tile: 2,
      isHome: true,
      planets: [
        {
          name: "Moll Primus",
          nsidName: "moll_primus",
          resources: 4,
          influence: 1,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_002.png",
    },
    {
      tile: 3,
      isHome: true,
      planets: [
        {
          name: "Darien",
          nsidName: "darien",
          resources: 4,
          influence: 4,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_003.png",
    },
    {
      tile: 4,
      isHome: true,
      planets: [
        {
          name: "Muaat",
          nsidName: "muaat",
          resources: 4,
          influence: 1,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_004.png",
    },
    {
      tile: 5,
      isHome: true,
      planets: [
        {
          name: "Nestphar",
          nsidName: "nestphar",
          resources: 3,
          influence: 2,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_005.png",
    },
    {
      tile: 6,
      isHome: true,
      planets: [
        {
          name: "000",
          nsidName: "000",
          resources: 5,
          influence: 0,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_006.png",
    },
    {
      tile: 7,
      isHome: true,
      planets: [
        {
          name: "Winnu",
          nsidName: "winnu",
          resources: 3,
          influence: 4,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_007.png",
    },
    {
      tile: 8,
      isHome: true,
      planets: [
        {
          name: "Mordai II",
          nsidName: "mordai_ii",
          resources: 4,
          influence: 0,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_008.png",
    },
    {
      tile: 9,
      isHome: true,
      planets: [
        {
          name: "Maaluuk",
          nsidName: "maaluuk",
          resources: 0,
          influence: 2,
        },
        {
          name: "Druaa",
          nsidName: "druaa",
          resources: 3,
          influence: 1,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_009.png",
    },
    {
      tile: 10,
      isHome: true,
      planets: [
        {
          name: "Arc Prime",
          nsidName: "arc_prime",
          resources: 4,
          influence: 0,
        },
        {
          name: "Wren Terra",
          nsidName: "wren_terra",
          resources: 2,
          influence: 1,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_010.png",
    },
    {
      tile: 11,
      isHome: true,
      planets: [
        {
          name: "Lisis II",
          nsidName: "lisis_ii",
          resources: 1,
          influence: 0,
          radius: 1.75,
        },
        {
          name: "Ragh",
          nsidName: "ragh",
          resources: 2,
          influence: 1,
          localPosition: { x: -1.8, y: 1.75 },
          radius: 1.75,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_011.png",
    },
    {
      tile: 12,
      isHome: true,
      planets: [
        {
          name: "Nar",
          nsidName: "nar",
          resources: 2,
          influence: 3,
        },
        {
          name: "Jol",
          nsidName: "jol",
          resources: 1,
          influence: 2,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_012.png",
    },
    {
      tile: 13,
      isHome: true,
      planets: [
        {
          name: "Trenlak",
          nsidName: "trenlak",
          resources: 1,
          influence: 0,
        },
        {
          name: "Quinarra",
          nsidName: "quinarra",
          resources: 3,
          influence: 1,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_013.png",
    },
    {
      tile: 14,
      isHome: true,
      planets: [
        {
          name: "Archon Ren",
          nsidName: "archon_ren",
          resources: 2,
          influence: 3,
        },
        {
          name: "Archon Tau",
          nsidName: "archon_tau",
          resources: 1,
          influence: 1,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_014.png",
    },
    {
      tile: 15,
      isHome: true,
      planets: [
        {
          name: "Retillion",
          nsidName: "retillion",
          resources: 2,
          influence: 3,
        },
        {
          name: "Shalloq",
          nsidName: "shalloq",
          resources: 1,
          influence: 2,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_015.png",
    },
    {
      tile: 16,
      isHome: true,
      planets: [
        {
          name: "Hercant",
          nsidName: "hercant",
          resources: 1,
          influence: 1,
        },
        {
          name: "Arretze",
          nsidName: "arretze",
          resources: 2,
          influence: 0,
        },
        {
          name: "Kamdorn",
          nsidName: "kamdorn",
          resources: 0,
          influence: 1,
        },
      ],
      img: "locale/ui/tiles/base/homeworld/tile_016.png",
    },
    {
      // Creuss gate, linked to home system.
      tile: 17,
      isExcludeFromDraft: true,
      wormholes: ["delta"],
      img: "locale/ui/tiles/base/homeworld/tile_017.png",
    },
    {
      tile: 18,
      planets: [
        {
          name: "Mecatol Rex",
          nsidName: "mecatol_rex",
          resources: 1,
          influence: 6,
          radius: 4,
        },
      ],
      img: "locale/ui/tiles/base/special/tile_018.png",
    },
    {
      tile: 19,
      planets: [
        {
          name: "Wellon",
          nsidName: "wellon",
          resources: 1,
          influence: 2,
          traits: ["industrial"],
          techs: ["yellow"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_019.png",
    },
    {
      tile: 20,
      planets: [
        {
          name: "Vefut II",
          nsidName: "vefut_ii",
          resources: 2,
          influence: 2,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_020.png",
    },
    {
      tile: 21,
      planets: [
        {
          name: "Thibah",
          nsidName: "thibah",
          resources: 1,
          influence: 1,
          traits: ["industrial"],
          techs: ["blue"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_021.png",
    },
    {
      tile: 22,
      planets: [
        {
          name: "Tarmann",
          nsidName: "tarmann",
          resources: 1,
          influence: 1,
          traits: ["industrial"],
          techs: ["green"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_022.png",
    },
    {
      tile: 23,
      planets: [
        {
          name: "Saudor",
          nsidName: "saudor",
          resources: 2,
          influence: 2,
          traits: ["industrial"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_023.png",
    },
    {
      tile: 24,
      planets: [
        {
          name: "Mehar Xull",
          nsidName: "mehar_xull",
          resources: 1,
          influence: 3,
          traits: ["hazardous"],
          techs: ["red"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_024.png",
    },
    {
      tile: 25,
      wormholes: ["beta"],
      planets: [
        {
          name: "Quann",
          nsidName: "quann",
          resources: 2,
          influence: 1,
          traits: ["cultural"],
          localPosition: { x: 2, y: -1.25 },
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_025.png",
    },
    {
      tile: 26,
      wormholes: ["alpha"],
      planets: [
        {
          name: "Lodor",
          nsidName: "lodor",
          resources: 3,
          influence: 1,
          traits: ["cultural"],
          localPosition: { x: 2, y: -1.25 },
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_026.png",
    },
    {
      tile: 27,
      planets: [
        {
          name: "New Albion",
          nsidName: "new_albion",
          resources: 1,
          influence: 1,
          traits: ["industrial"],
          techs: ["green"],
        },
        {
          name: "Starpoint",
          nsidName: "starpoint",
          resources: 3,
          influence: 1,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_027.png",
    },
    {
      tile: 28,
      planets: [
        {
          name: "Tequran",
          nsidName: "tequran",
          resources: 2,
          influence: 0,
          traits: ["hazardous"],
        },
        {
          name: "Torkan",
          nsidName: "torkan",
          resources: 0,
          influence: 3,
          traits: ["cultural"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_028.png",
    },
    {
      tile: 29,
      planets: [
        {
          name: "Qucenn",
          nsidName: "qucenn",
          resources: 1,
          influence: 2,
          traits: ["industrial"],
        },
        {
          name: "Rarron",
          nsidName: "rarron",
          resources: 0,
          influence: 3,
          traits: ["cultural"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_029.png",
    },
    {
      tile: 30,
      planets: [
        {
          name: "Mellon",
          nsidName: "mellon",
          resources: 0,
          influence: 2,
          traits: ["cultural"],
        },
        {
          name: "Zohbat",
          nsidName: "zohbat",
          resources: 3,
          influence: 1,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_030.png",
    },
    {
      tile: 31,
      planets: [
        {
          name: "Lazar",
          nsidName: "lazar",
          resources: 1,
          influence: 0,
          traits: ["industrial"],
          techs: ["yellow"],
        },
        {
          name: "Sakulag",
          nsidName: "sakulag",
          resources: 2,
          influence: 1,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_031.png",
    },
    {
      tile: 32,
      planets: [
        {
          name: "Dal Bootha",
          nsidName: "dal_bootha",
          resources: 0,
          influence: 2,
          traits: ["cultural"],
        },
        {
          name: "Xxehan",
          nsidName: "xxehan",
          resources: 1,
          influence: 1,
          traits: ["cultural"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_032.png",
    },
    {
      tile: 33,
      planets: [
        {
          name: "Corneeq",
          nsidName: "corneeq",
          resources: 1,
          influence: 2,
          traits: ["cultural"],
        },
        {
          name: "Resculon",
          nsidName: "resculon",
          resources: 2,
          influence: 0,
          traits: ["cultural"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_033.png",
    },
    {
      tile: 34,
      planets: [
        {
          name: "Centauri",
          nsidName: "centauri",
          resources: 1,
          influence: 3,
          traits: ["cultural"],
        },
        {
          name: "Gral",
          nsidName: "gral",
          resources: 1,
          influence: 1,
          traits: ["industrial"],
          techs: ["blue"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_034.png",
    },
    {
      tile: 35,
      planets: [
        {
          name: "Bereg",
          nsidName: "bereg",
          resources: 3,
          influence: 1,
          traits: ["hazardous"],
        },
        {
          name: "Lirta IV",
          nsidName: "lirta_iv",
          resources: 2,
          influence: 3,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_035.png",
    },
    {
      tile: 36,
      planets: [
        {
          name: "Arnor",
          nsidName: "arnor",
          resources: 2,
          influence: 1,
          traits: ["industrial"],
        },
        {
          name: "Lor",
          nsidName: "lor",
          resources: 1,
          influence: 2,
          traits: ["industrial"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_036.png",
    },
    {
      tile: 37,
      planets: [
        {
          name: "Arinam",
          nsidName: "arinam",
          resources: 1,
          influence: 2,
          traits: ["industrial"],
        },
        {
          name: "Meer",
          nsidName: "meer",
          resources: 0,
          influence: 4,
          traits: ["hazardous"],
          techs: ["red"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_037.png",
    },
    {
      tile: 38,
      planets: [
        {
          name: "Abyz",
          nsidName: "abyz",
          resources: 3,
          influence: 0,
          traits: ["hazardous"],
        },
        {
          name: "Fria",
          nsidName: "fria",
          resources: 2,
          influence: 0,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/base/regular/tile_038.png",
    },
    {
      tile: 39,
      wormholes: ["alpha"],
      img: "global/ui/tiles/base/hazard/tile_039.png",
    },
    {
      tile: 40,
      wormholes: ["beta"],
      img: "global/ui/tiles/base/hazard/tile_040.png",
    },
    {
      tile: 41,
      anomalies: ["gravity_rift"],
      img: "global/ui/tiles/base/hazard/tile_041.png",
    },
    {
      tile: 42,
      anomalies: ["nebula"],
      img: "global/ui/tiles/base/hazard/tile_042.png",
    },
    {
      tile: 43,
      anomalies: ["supernova"],
      img: "global/ui/tiles/base/hazard/tile_043.png",
    },
    {
      tile: 44,
      anomalies: ["asteroid_field"],
      img: "global/ui/tiles/base/hazard/tile_044.png",
    },
    {
      tile: 45,
      anomalies: ["asteroid_field"],
      img: "global/ui/tiles/base/hazard/tile_045.png",
    },
    {
      tile: 46,
      img: "global/ui/tiles/base/hazard/tile_046.png",
    },
    {
      tile: 47,
      img: "global/ui/tiles/base/hazard/tile_047.png",
    },
    {
      tile: 48,
      img: "global/ui/tiles/base/hazard/tile_048.png",
    },
    {
      tile: 49,
      img: "global/ui/tiles/base/hazard/tile_049.png",
    },
    {
      tile: 50,
      img: "global/ui/tiles/base/hazard/tile_050.png",
    },
    {
      tile: 51,
      class: "offMap",
      isHome: true,
      wormholes: ["delta"],
      planets: [
        {
          name: "Creuss",
          nsidName: "creuss",
          resources: 4,
          influence: 2,
          localPosition: { x: 1, y: 0 },
        },
      ],
      img: "locale/ui/tiles/base/special/tile_051.png",
    },
  ],
  pok: [
    {
      tile: 52,
      isHome: true,
      planets: [
        {
          name: "Ixth",
          nsidName: "ixth",
          resources: 3,
          influence: 5,
        },
      ],
      img: "locale/ui/tiles/pok/homeworld/tile_052.png",
    },
    {
      tile: 53,
      isHome: true,
      planets: [
        {
          name: "Arcturus",
          nsidName: "arcturus",
          resources: 4,
          influence: 4,
        },
      ],
      img: "locale/ui/tiles/pok/homeworld/tile_053.png",
    },
    {
      tile: 54,
      isHome: true,
      planets: [
        {
          name: "Acheron",
          nsidName: "acheron",
          resources: 4,
          influence: 0,
        },
      ],
      img: "locale/ui/tiles/pok/homeworld/tile_054.png",
    },
    {
      tile: 55,
      isHome: true,
      planets: [
        {
          name: "Elysium",
          nsidName: "elysium",
          resources: 4,
          influence: 1,
          localPosition: { x: 0.75, y: 0 },
          radius: 3.25,
        },
      ],
      img: "locale/ui/tiles/pok/homeworld/tile_055.png",
    },
    {
      tile: 56,
      isHome: true,
      anomalies: ["nebula"],
      planets: [
        {
          name: "The Dark",
          nsidName: "the_dark",
          resources: 3,
          influence: 4,
        },
      ],
      img: "locale/ui/tiles/pok/homeworld/tile_056.png",
    },
    {
      tile: 57,
      isHome: true,
      planets: [
        {
          name: "Naazir",
          nsidName: "naazir",
          resources: 2,
          influence: 1,
        },
        {
          name: "Rokha",
          nsidName: "rokha",
          resources: 1,
          influence: 2,
        },
      ],
      img: "locale/ui/tiles/pok/homeworld/tile_057.png",
    },
    {
      tile: 58,
      isHome: true,
      planets: [
        {
          name: "Valk",
          nsidName: "valk",
          resources: 2,
          influence: 0,
          localPosition: { x: 0.5, y: -2.75 },
        },
        {
          name: "Ylir",
          nsidName: "ylir",
          resources: 0,
          influence: 2,
          localPosition: { x: 2.3, y: 1.3 },
        },
        {
          name: "Avar",
          nsidName: "avar",
          resources: 1,
          influence: 1,
          localPosition: { x: -2.5, y: 1.7 },
        },
      ],
      img: "locale/ui/tiles/pok/homeworld/tile_058.png",
    },
    {
      tile: 59,
      planets: [
        {
          name: "Archon Vail",
          nsidName: "archon_vail",
          resources: 1,
          influence: 3,
          traits: ["hazardous"],
          techs: ["blue"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_059.png",
    },
    {
      tile: 60,
      planets: [
        {
          name: "Perimeter",
          nsidName: "perimeter",
          resources: 2,
          influence: 1,
          traits: ["industrial"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_060.png",
    },
    {
      tile: 61,
      planets: [
        {
          name: "Ang",
          nsidName: "ang",
          resources: 2,
          influence: 0,
          traits: ["industrial"],
          techs: ["red"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_061.png",
    },
    {
      tile: 62,
      planets: [
        {
          name: "Semlore",
          nsidName: "semlore",
          resources: 3,
          influence: 2,
          traits: ["cultural"],
          techs: ["yellow"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_062.png",
    },
    {
      tile: 63,
      planets: [
        {
          name: "Vorhal",
          nsidName: "vorhal",
          resources: 0,
          influence: 2,
          traits: ["cultural"],
          techs: ["green"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_063.png",
    },
    {
      tile: 64,
      wormholes: ["beta"],
      planets: [
        {
          name: "Atlas",
          nsidName: "atlas",
          resources: 3,
          influence: 1,
          traits: ["hazardous"],
          localPosition: { x: 2, y: -1.25 },
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_064.png",
    },
    {
      tile: 65,
      planets: [
        {
          name: "Primor",
          nsidName: "primor",
          resources: 2,
          influence: 1,
          traits: ["cultural"],
          radius: 3.25,
          isLegendary: true,
          legendaryNsidName: "the_atrament",
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_065.png",
    },
    {
      tile: 66,
      planets: [
        {
          name: "Hopes End",
          nsidName: "hopes_end",
          resources: 3,
          influence: 0,
          traits: ["hazardous"],
          radius: 3.25,
          isLegendary: true,
          legendaryNsidName: "imperial_arms_vault",
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_066.png",
    },
    {
      tile: 67,
      anomalies: ["gravity_rift"],
      planets: [
        {
          name: "Cormund",
          nsidName: "cormund",
          resources: 2,
          influence: 0,
          traits: ["hazardous"],
          localPosition: { x: 0.7, y: -1 },
        },
      ],
      img: "locale/ui/tiles/pok/hazard/tile_067.png",
    },
    {
      tile: 68,
      anomalies: ["nebula"],
      planets: [
        {
          name: "Everra",
          nsidName: "everra",
          resources: 3,
          influence: 1,
          traits: ["cultural"],
          localPosition: { x: 0.5, y: -1 },
        },
      ],
      img: "locale/ui/tiles/pok/hazard/tile_068.png",
    },
    {
      tile: 69,
      planets: [
        {
          name: "Accoen",
          nsidName: "accoen",
          resources: 2,
          influence: 3,
          traits: ["industrial"],
        },
        {
          name: "Jeol Ir",
          nsidName: "jeol_ir",
          resources: 2,
          influence: 3,
          traits: ["industrial"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_069.png",
    },
    {
      tile: 70,
      planets: [
        {
          name: "Kraag",
          nsidName: "kraag",
          resources: 2,
          influence: 1,
          traits: ["hazardous"],
        },
        {
          name: "Siig",
          nsidName: "siig",
          resources: 0,
          influence: 2,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_070.png",
    },
    {
      tile: 71,
      planets: [
        {
          name: "Bakal",
          nsidName: "bakal",
          resources: 3,
          influence: 2,
          traits: ["industrial"],
        },
        {
          name: "Alio Prima",
          nsidName: "alio_prima",
          resources: 1,
          influence: 1,
          traits: ["cultural"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_071.png",
    },
    {
      tile: 72,
      planets: [
        {
          name: "Lisis",
          nsidName: "lisis",
          resources: 2,
          influence: 2,
          traits: ["industrial"],
        },
        {
          name: "Velnor",
          nsidName: "velnor",
          resources: 2,
          influence: 1,
          traits: ["industrial"],
          techs: ["red"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_072.png",
    },
    {
      tile: 73,
      planets: [
        {
          name: "Cealdri",
          nsidName: "cealdri",
          resources: 0,
          influence: 2,
          traits: ["cultural"],
          techs: ["yellow"],
        },
        {
          name: "Xanhact",
          nsidName: "xanhact",
          resources: 0,
          influence: 1,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_073.png",
    },
    {
      tile: 74,
      planets: [
        {
          name: "Vega Major",
          nsidName: "vega_major",
          resources: 2,
          influence: 1,
          traits: ["cultural"],
        },
        {
          name: "Vega Minor",
          nsidName: "vega_minor",
          resources: 1,
          influence: 2,
          traits: ["cultural"],
          techs: ["blue"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_074.png",
    },
    {
      tile: 75,
      planets: [
        {
          name: "Loki",
          nsidName: "loki",
          resources: 1,
          influence: 2,
          traits: ["cultural"],
        },
        {
          name: "Abaddon",
          nsidName: "abaddon",
          resources: 1,
          influence: 0,
          traits: ["cultural"],
        },
        {
          name: "Ashtroth",
          nsidName: "ashtroth",
          resources: 2,
          influence: 0,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_075.png",
    },
    {
      tile: 76,
      planets: [
        {
          name: "Rigel III",
          nsidName: "rigel_iii",
          resources: 1,
          influence: 1,
          traits: ["industrial"],
          techs: ["green"],
        },
        {
          name: "Rigel II",
          nsidName: "rigel_ii",
          resources: 1,
          influence: 2,
          traits: ["industrial"],
        },
        {
          name: "Rigel I",
          nsidName: "rigel_i",
          resources: 0,
          influence: 1,
          traits: ["hazardous"],
        },
      ],
      img: "locale/ui/tiles/pok/regular/tile_076.png",
    },
    {
      tile: 77,
      img: "global/ui/tiles/pok/hazard/tile_077.png",
    },
    {
      tile: 78,
      img: "global/ui/tiles/pok/hazard/tile_078.png",
    },
    {
      tile: 79,
      anomalies: ["asteroid_field"],
      wormholes: ["alpha"],
      img: "global/ui/tiles/pok/hazard/tile_079.png",
    },
    {
      tile: 80,
      anomalies: ["supernova"],
      img: "global/ui/tiles/pok/hazard/tile_080.png",
    },
    {
      tile: 81,
      isExcludeFromDraft: true,
      anomalies: ["supernova"], // muaat hero supernova tile
      img: "global/ui/tiles/pok/special/tile_081.png",
    },
    {
      tile: 82,
      class: "offMap",
      wormholes: ["alpha", "beta", "gamma"],
      wormholesFaceDown: ["gamma"],
      planets: [
        {
          name: "Mallice",
          nsidName: "mallice",
          resources: 0,
          influence: 3,
          isLegendary: true,
          legendaryNsidName: "exterrix_headquarters",
          traits: ["cultural"],
          localPosition: { x: 1.2, y: 1 },
        },
      ],
      img: "locale/ui/tiles/pok/special/tile_082.png",
    },
    {
      tile: 83,
      isHyperlane: true,
      //hyperlaneFaceUp: [[], [], [5], [], [], [2]],
      //hyperlaneFaceDown: [[3, 4], [3], [], [0, 1], [0], []],
      img: "global/ui/tiles/pok/hyperlane/tile_083_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_083_r.png",
    },
    {
      tile: 84,
      isHyperlane: true,
      //hyperlaneFaceUp: [[], [4], [], [], [1], []],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0, 5], [], [3]],
      img: "global/ui/tiles/pok/hyperlane/tile_084_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_084_r.png",
    },
    {
      tile: 85,
      isHyperlane: true,
      //hyperlaneFaceUp: [[], [5], [], [], [], [1]],
      //hyperlaneFaceDown: [[3, 4], [3], [], [0, 1], [0], []],
      img: "global/ui/tiles/pok/hyperlane/tile_085_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_085_r.png",
    },
    {
      tile: 86,
      isHyperlane: true,
      //hyperlaneFaceUp: [[], [5], [], [], [], [1]],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0, 5], [], [3]],
      img: "global/ui/tiles/pok/hyperlane/tile_086_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_086_r.png",
    },
    {
      tile: 87,
      isHyperlane: true,
      //hyperlaneFaceUp: [[4], [4], [4], [], [0, 1, 2], []],
      //hyperlaneFaceDown: [[3, 4], [], [], [0], [0], []],
      img: "global/ui/tiles/pok/hyperlane/tile_087_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_087_r.png",
    },
    {
      tile: 88,
      isHyperlane: true,
      //hyperlaneFaceUp: [[2], [], [0, 4, 5], [], [2], [2]],
      //hyperlaneFaceDown: [[3, 4], [3], [], [0, 1], [0], []],
      img: "global/ui/tiles/pok/hyperlane/tile_088_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_088_r.png",
    },
    {
      tile: 89,
      isHyperlane: true,
      //hyperlaneFaceUp: [[2, 4], [], [0, 4], [], [0, 2], []],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0], [], []],
      img: "global/ui/tiles/pok/hyperlane/tile_089_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_089_r.png",
    },
    {
      tile: 90,
      isHyperlane: true,
      //hyperlaneFaceUp: [[], [5], [4], [], [2], [1]],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0], [], []],
      img: "global/ui/tiles/pok/hyperlane/tile_090_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_090_r.png",
    },
    {
      tile: 91,
      isHyperlane: true,
      //hyperlaneFaceUp: [[2, 3], [], [0], [0, 5], [], [3]],
      //hyperlaneFaceDown: [[3, 4], [], [], [0], [0], []],
      img: "global/ui/tiles/pok/hyperlane/tile_091_o.png",
      imgFaceDown: "global/ui/tiles/pok/hyperlane/tile_091_r.png",
    },
  ],

  ["codex.vigil"]: [
    // Planets without a system.
    {
      tile: -9,
      planets: [
        {
          name: "Custodia Vigilia",
          nsidName: "custodia_vigilia",
          resources: 2,
          influence: 3,
          isLegendary: true,
          legendaryNsidName: "custodia_vigilia",
        },
      ],
      img: "",
    },
  ],
};
