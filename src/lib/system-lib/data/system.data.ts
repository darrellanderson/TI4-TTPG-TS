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
          radius: 3.95,
        },
        {
          name: "Ragh",
          nsidName: "ragh",
          resources: 2,
          influence: 1,
          localPosition: { x: -2.7, y: 2.63 },
          radius: 3.95,
        },
      ],
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
    },
    {
      // Creuss gate, linked to home system.
      tile: 17,
      isExcludeFromDraft: true,
      wormholes: ["delta"],
    },
    {
      tile: 18,
      isExcludeFromDraft: true,
      planets: [
        {
          name: "Mecatol Rex",
          nsidName: "mecatol_rex",
          resources: 1,
          influence: 6,
          radius: 6,
        },
      ],
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
          localPosition: { x: 3, y: -1.88 },
        },
      ],
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
          localPosition: { x: 3, y: -1.88 },
        },
      ],
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
    },
    {
      tile: 39,
      wormholes: ["alpha"],
    },
    {
      tile: 40,
      wormholes: ["beta"],
    },
    {
      tile: 41,
      anomalies: ["gravity-rift"],
    },
    {
      tile: 42,
      anomalies: ["nebula"],
    },
    {
      tile: 43,
      anomalies: ["supernova"],
    },
    {
      tile: 44,
      anomalies: ["asteroid-field"],
    },
    {
      tile: 45,
      anomalies: ["asteroid-field"],
    },
    {
      tile: 46,
    },
    {
      tile: 47,
    },
    {
      tile: 48,
    },
    {
      tile: 49,
    },
    {
      tile: 50,
    },
    {
      tile: 51,
      class: "off-map",
      isHome: true,
      wormholes: ["delta"],
      planets: [
        {
          name: "Creuss",
          nsidName: "creuss",
          resources: 4,
          influence: 2,
          localPosition: { x: 1.5, y: 0 },
        },
      ],
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
          localPosition: { x: 1.13, y: 0 },
          radius: 4.88,
        },
      ],
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
          localPosition: { x: 0.75, y: -4.13 },
        },
        {
          name: "Ylir",
          nsidName: "ylir",
          resources: 0,
          influence: 2,
          localPosition: { x: 3.45, y: 1.95 },
        },
        {
          name: "Avar",
          nsidName: "avar",
          resources: 1,
          influence: 1,
          localPosition: { x: -3.75, y: 2.55 },
        },
      ],
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
          localPosition: { x: 3, y: -1.88 },
        },
      ],
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
          radius: 4.88,
          isLegendary: true,
          legendaryNsidName: "the_atrament",
        },
      ],
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
          radius: 4.88,
          isLegendary: true,
          legendaryNsidName: "imperial_arms_vault",
        },
      ],
    },
    {
      tile: 67,
      anomalies: ["gravity-rift"],
      planets: [
        {
          name: "Cormund",
          nsidName: "cormund",
          resources: 2,
          influence: 0,
          traits: ["hazardous"],
          localPosition: { x: 1.05, y: -1.5 },
        },
      ],
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
          localPosition: { x: 0.75, y: -1.5 },
        },
      ],
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
    },
    {
      tile: 77,
    },
    {
      tile: 78,
    },
    {
      tile: 79,
      anomalies: ["asteroid-field"],
      wormholes: ["alpha"],
    },
    {
      tile: 80,
      anomalies: ["supernova"],
    },
    {
      tile: 81, // muaat hero supernova tile
      isExcludeFromDraft: true,
      anomalies: ["supernova"],
    },
    {
      tile: 82,
      class: "off-map",
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
          localPosition: { x: 1.8, y: 1.5 },
        },
      ],
    },
    {
      tile: 83,
      isHyperlane: true,
      hyperlanes: { sw: ["ne"], ne: ["sw"] },
      hyperlanesFaceDown: {
        n: ["s", "se"],
        nw: ["s"],
        s: ["n", "nw"],
        se: ["n"],
      },
      // dirs = ['n', 'nw', 'sw', 's', 'se', 'ne']
      // f = (input) => { const out = {}; for (let i = 0; i < 6; i++) {const key = dirs[i]; out[key] = input[i].map((d)=>dirs[d]) } return out}
      //hyperlaneFaceUp: [[], [], [5], [], [], [2]],
      //hyperlaneFaceDown: [[3, 4], [3], [], [0, 1], [0], []],
      imgFaceDown: true,
    },
    {
      tile: 84,
      isHyperlane: true,
      hyperlanes: { nw: ["se"], se: ["nw"] },
      hyperlanesFaceDown: {
        n: ["sw", "s"],
        sw: ["n"],
        s: ["n", "ne"],
        ne: ["s"],
      },
      //hyperlaneFaceUp: [[], [4], [], [], [1], []],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0, 5], [], [3]],
      imgFaceDown: true,
    },
    {
      tile: 85,
      isHyperlane: true,
      hyperlanes: { nw: ["ne"], ne: ["nw"] },
      hyperlanesFaceDown: {
        n: ["s", "se"],
        nw: ["s"],
        s: ["n", "nw"],
        se: ["n"],
      },
      //hyperlaneFaceUp: [[], [5], [], [], [], [1]],
      //hyperlaneFaceDown: [[3, 4], [3], [], [0, 1], [0], []],
      imgFaceDown: true,
    },
    {
      tile: 86,
      isHyperlane: true,
      hyperlanes: { nw: ["ne"], ne: ["nw"] },
      hyperlanesFaceDown: {
        n: ["sw", "s"],
        sw: ["n"],
        s: ["n", "ne"],
        ne: ["s"],
      },
      //hyperlaneFaceUp: [[], [5], [], [], [], [1]],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0, 5], [], [3]],
      imgFaceDown: true,
    },
    {
      tile: 87,
      isHyperlane: true,
      hyperlanes: { n: ["se"], nw: ["se"], sw: ["se"], se: ["n", "nw", "sw"] },
      hyperlanesFaceDown: { n: ["s", "se"], s: ["n"], se: ["n"] },
      //hyperlaneFaceUp: [[4], [4], [4], [], [0, 1, 2], []],
      //hyperlaneFaceDown: [[3, 4], [], [], [0], [0], []],
      imgFaceDown: true,
    },
    {
      tile: 88,
      isHyperlane: true,
      hyperlanes: { n: ["sw"], sw: ["n", "se", "ne"], se: ["sw"], ne: ["sw"] },
      hyperlanesFaceDown: {
        n: ["s", "se"],
        nw: ["s"],
        s: ["n", "nw"],
        se: ["n"],
      },
      //hyperlaneFaceUp: [[2], [], [0, 4, 5], [], [2], [2]],
      //hyperlaneFaceDown: [[3, 4], [3], [], [0, 1], [0], []],
      imgFaceDown: true,
    },
    {
      tile: 89,
      isHyperlane: true,
      hyperlanes: { n: ["sw", "se"], sw: ["n", "se"], se: ["n", "sw"] },
      hyperlanesFaceDown: { n: ["sw", "s"], sw: ["n"], s: ["n"] },
      //hyperlaneFaceUp: [[2, 4], [], [0, 4], [], [0, 2], []],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0], [], []],
      imgFaceDown: true,
    },
    {
      tile: 90,
      isHyperlane: true,
      hyperlanes: { nw: ["ne"], sw: ["se"], se: ["sw"], ne: ["nw"] },
      hyperlanesFaceDown: { n: ["sw", "s"], sw: ["n"], s: ["n"] },
      //hyperlaneFaceUp: [[], [5], [4], [], [2], [1]],
      //hyperlaneFaceDown: [[2, 3], [], [0], [0], [], []],
      imgFaceDown: true,
    },
    {
      tile: 91,
      isHyperlane: true,
      hyperlanes: { n: ["sw", "s"], sw: ["n"], s: ["n", "ne"], ne: ["s"] },
      hyperlanesFaceDown: { n: ["s", "se"], s: ["n"], se: ["n"] },
      //hyperlaneFaceUp: [[2, 3], [], [0], [0, 5], [], [3]],
      //hyperlaneFaceDown: [[3, 4], [], [], [0], [0], []],
      imgFaceDown: true,
    },
  ],

  ["codex.vigil"]: [
    // Planets without a system.
    {
      tile: -9,
      isExcludeFromDraft: true,
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
    },
  ],
};
