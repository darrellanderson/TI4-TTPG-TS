import { TechSchemaType } from "../schema/tech-schema";

export const SOURCE_TO_TECH_DATA: Record<string, Array<TechSchemaType>> = {
  base: [
    {
      nsidName: "advanced-carrier-2",
      name: "Advanced Carrier II",
      color: "unit-upgrade",
      prerequisites: { blue: 2 },
      abbr: "Adv Carrier II",
      isFactionTech: true,
      replacesNsidName: "carrier-2",
    },
    {
      nsidName: "antimass-deflectors",
      name: "Antimass Deflectors",
      color: "blue",
      prerequisites: {},
      abbr: "Antimass",
    },
    {
      nsidName: "assault-cannon",
      name: "Assault Cannon",
      color: "red",
      prerequisites: { red: 3 },
      abbr: "Assault Cannon",
    },
    {
      nsidName: "bioplasmosis",
      name: "Bioplasmosis",
      color: "green",
      prerequisites: { green: 2 },
      abbr: "Bioplas",
      isFactionTech: true,
    },
    {
      nsidName: "carrier-2",
      name: "Carrier II",
      color: "unit-upgrade",
      prerequisites: { blue: 2 },
      abbr: "Carrier II",
    },
    {
      nsidName: "chaos-mapping",
      name: "Chaos Mapping",
      color: "blue",
      prerequisites: { blue: 1 },
      abbr: "Chaos Map",
      isFactionTech: true,
    },
    {
      nsidName: "cruiser-2",
      name: "Cruiser II",
      color: "unit-upgrade",
      prerequisites: { red: 1, green: 1, yellow: 1 },
      abbr: "Cruiser II",
    },
    {
      nsidName: "dacxive-animators",
      name: "Dacxive Animators",
      color: "green",
      prerequisites: { green: 1 },
      abbr: "Dacxive",
    },
    {
      nsidName: "destroyer-2",
      name: "Destroyer II",
      color: "unit-upgrade",
      prerequisites: { red: 2 },
      abbr: "Destroyer II",
    },
    {
      nsidName: "dimensional-splicer",
      name: "Dimensional Splicer",
      color: "red",
      prerequisites: { red: 1 },
      abbr: "D. Splicer",
      isFactionTech: true,
    },
    {
      nsidName: "dreadnought-2",
      name: "Dreadnought II",
      color: "unit-upgrade",
      prerequisites: { blue: 2, yellow: 1 },
      abbr: "Dread II",
    },
    {
      nsidName: "duranium-armor",
      name: "Duranium Armor",
      color: "red",
      prerequisites: { red: 2 },
      abbr: "Duranium",
    },
    {
      nsidName: "e-res-siphons",
      name: "E-res Siphons",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "E-Res",
      isFactionTech: true,
    },
    {
      nsidName: "exotrireme-2",
      name: "Exotrireme II",
      color: "unit-upgrade",
      prerequisites: { blue: 2, yellow: 1 },
      abbr: "Exotrireme II",
      isFactionTech: true,
      replacesNsidName: "dreadnought-2",
    },
    {
      nsidName: "fighter-2",
      name: "Fighter II",
      color: "unit-upgrade",
      prerequisites: { green: 1, blue: 1 },
      abbr: "Fighter II",
    },
    {
      nsidName: "fleet-logistics",
      name: "Fleet Logistics",
      color: "blue",
      prerequisites: { blue: 2 },
      abbr: "Fleet Logistics",
    },
    {
      nsidName: "floating-factory-2",
      name: "Floating Factory II",
      color: "unit-upgrade",
      prerequisites: { yellow: 2 },
      abbr: "FF II",
      isFactionTech: true,
      replacesNsidName: "space-dock-2",
    },
    {
      nsidName: "graviton-laser-system",
      name: "Graviton Laser System",
      color: "yellow",
      prerequisites: { yellow: 1 },
      abbr: "Graviton",
    },
    {
      nsidName: "gravity-drive",
      name: "Gravity Drive",
      color: "blue",
      prerequisites: { blue: 1 },
      abbr: "Grav Drive",
    },
    {
      nsidName: "hegemonic-trade-policy",
      name: "Hegemonic Trade Policy",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "Hegemonic",
      isFactionTech: true,
    },
    {
      nsidName: "hybrid-crystal-fighter-2",
      name: "Hybrid Crystal Fighter II",
      color: "unit-upgrade",
      prerequisites: { green: 1, blue: 1 },
      abbr: " HCF II",
      isFactionTech: true,
      replacesNsidName: "fighter-2",
    },
    {
      nsidName: "hyper-metabolism",
      name: "Hyper Metabolism",
      color: "green",
      prerequisites: { green: 2 },
      abbr: "Hyper",
    },
    {
      nsidName: "impulse-core",
      name: "Impulse Core",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "Impulse",
      isFactionTech: true,
    },
    {
      nsidName: "infantry-2",
      name: "Infantry II",
      color: "unit-upgrade",
      prerequisites: { green: 2 },
      abbr: "Infantry II",
    },
    {
      nsidName: "inheritance-systems",
      name: "Inheritance Systems",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "Inherit. Systems",
      isFactionTech: true,
    },
    {
      nsidName: "instinct-training",
      name: "Instinct Training",
      color: "green",
      prerequisites: { green: 1 },
      abbr: "Instinct Train",
      isFactionTech: true,
    },
    {
      nsidName: "integrated-economy",
      name: "Integrated Economy",
      color: "yellow",
      prerequisites: { yellow: 3 },
      abbr: "Integrated Eco.",
    },
    {
      nsidName: "l4-disruptors",
      name: "L4 Disruptors",
      color: "yellow",
      prerequisites: { yellow: 1 },
      abbr: "L4 Disrupt",
      isFactionTech: true,
    },
    {
      nsidName: "lazax-gate-folding",
      name: "Lazax Gate Folding",
      color: "blue",
      prerequisites: { blue: 2 },
      abbr: "Lazax Gate",
      isFactionTech: true,
    },
    {
      nsidName: "letani-warrior-2",
      name: "Letani Warrior II",
      color: "unit-upgrade",
      prerequisites: { green: 1 },
      abbr: "Letani II",
      isFactionTech: true,
      replacesNsidName: "infantry-2",
    },
    {
      nsidName: "lightwave-deflector",
      name: "Light-Wave Deflector",
      color: "blue",
      prerequisites: { blue: 3 },
      abbr: "Light/Wave",
    },
    {
      nsidName: "magen-defense-grid",
      name: "Magen Defense Grid",
      color: "red",
      prerequisites: { red: 1 },
      abbr: "Magen",
    },
    {
      nsidName: "mageon-implants",
      name: "Mageon Implants",
      color: "green",
      prerequisites: { green: 3 },
      abbr: "Mageon",
      isFactionTech: true,
    },
    {
      nsidName: "magmus-reactor",
      name: "Magmus Reactor",
      color: "red",
      prerequisites: { red: 2 },
      abbr: "Magmus",
      isFactionTech: true,
    },
    {
      nsidName: "mirror-computing",
      name: "Mirror Computing",
      color: "yellow",
      prerequisites: { yellow: 3 },
      abbr: "Mirror Comp",
      isFactionTech: true,
    },
    {
      nsidName: "neural-motivator",
      name: "Neural Motivator",
      color: "green",
      prerequisites: {},
      abbr: "Neural",
    },
    {
      nsidName: "neuroglaive",
      name: "Neuroglaive",
      color: "green",
      prerequisites: { green: 3 },
      abbr: "Neuroglaive",
      isFactionTech: true,
    },
    {
      nsidName: "noneuclidean-shielding",
      name: "Non-Euclidean Shielding",
      color: "red",
      prerequisites: { red: 2 },
      abbr: "N.E.S.",
      isFactionTech: true,
    },
    {
      nsidName: "nullification-field",
      name: "Nullification Field",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "Null. Field",
      isFactionTech: true,
    },
    {
      nsidName: "pds-2",
      name: "PDS II",
      color: "unit-upgrade",
      prerequisites: { red: 1, yellow: 1 },
      abbr: "PDS II",
    },
    {
      nsidName: "plasma-scoring",
      name: "Plasma Scoring",
      color: "red",
      prerequisites: {},
      abbr: "Plasma",
    },
    {
      nsidName: "production-biomes",
      name: "Production Biomes",
      color: "green",
      prerequisites: { green: 2 },
      abbr: "Prod. Biomes",
      isFactionTech: true,
    },
    {
      nsidName: "prototype-war-sun-2",
      name: "Prototype War Sun II",
      color: "unit-upgrade",
      prerequisites: { red: 3, yellow: 1 },
      abbr: "PWS II",
      isFactionTech: true,
      replacesNsidName: "war-sun-2",
    },
    {
      nsidName: "quantum-datahub-node",
      name: "Quantum Datahub Node",
      color: "yellow",
      prerequisites: { yellow: 3 },
      abbr: "QDHN",
      isFactionTech: true,
    },
    {
      nsidName: "salvage-operations",
      name: "Salvage Operations",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "Salvage Ops.",
      isFactionTech: true,
    },
    {
      nsidName: "sarween-tools",
      name: "Sarween Tools",
      color: "yellow",
      prerequisites: {},
      abbr: "Sarween",
    },
    {
      nsidName: "space-dock-2",
      name: "Space Dock II",
      color: "unit-upgrade",
      prerequisites: { yellow: 2 },
      abbr: "Space Dock II",
    },
    {
      nsidName: "spacial-conduit-cylinder",
      name: "Spacial Conduit Cylinder",
      color: "blue",
      prerequisites: { blue: 2 },
      abbr: "Spacial Conduit",
      isFactionTech: true,
    },
    {
      nsidName: "spec-ops-2",
      name: "Spec Ops II",
      color: "unit-upgrade",
      prerequisites: { green: 2 },
      abbr: "Spec Ops II",
      isFactionTech: true,
      replacesNsidName: "infantry-2",
    },
    {
      nsidName: "super-dreadnought-2",
      name: "Super Dreadnought II",
      color: "unit-upgrade",
      prerequisites: { blue: 2, yellow: 1 },
      abbr: "SuperDread II",
      isFactionTech: true,
      replacesNsidName: "dreadnought-2",
    },
    {
      nsidName: "transit-diodes",
      name: "Transit Diodes",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "Transit",
    },
    {
      nsidName: "transparasteel-plating",
      name: "Transparasteel Plating",
      color: "green",
      prerequisites: { green: 1 },
      abbr: "Transparasteel",
      isFactionTech: true,
    },
    {
      nsidName: "valefar-assimilator-x",
      name: "Valefar Assimilator X",
      color: "none",
      prerequisites: {},
      isFactionTech: true,
    },
    {
      nsidName: "valefar-assimilator-y",
      name: "Valefar Assimilator Y",
      color: "none",
      prerequisites: {},
      isFactionTech: true,
    },
    {
      nsidName: "valkyrie-particle-weave",
      name: "Valkyrie Particle Weave",
      color: "red",
      prerequisites: { red: 2 },
      abbr: "Valkyrie PW",
      isFactionTech: true,
    },
    {
      nsidName: "war-sun-2",
      name: "War Sun",
      color: "unit-upgrade",
      prerequisites: { red: 3, yellow: 1 },
      abbr: "War Sun",
    },
    {
      nsidName: "wormhole-generator",
      name: "Wormhole Generator",
      color: "blue",
      prerequisites: { blue: 2 },
      abbr: "Wormhole Gen",
      isFactionTech: true,
    },
    {
      nsidName: "x89-bacterial-weapon",
      name: "X-89 Bacterial Weapon",
      color: "green",
      prerequisites: { green: 3 },
      abbr: "X-89 B.W.",
    },
    {
      nsidName: "yin-spinner",
      name: "Yin Spinner",
      color: "green",
      prerequisites: { green: 2 },
      abbr: "Yin Spin",
      isFactionTech: true,
    },
  ],
  pok: [
    {
      nsidName: "aerie-hololattice",
      name: "Aerie Hololattice",
      color: "yellow",
      prerequisites: { yellow: 1 },
      abbr: "Aerie Holo",
      isFactionTech: true,
    },
    {
      nsidName: "aetherstream",
      name: "Aetherstream",
      color: "blue",
      prerequisites: { blue: 2 },
      abbr: "Aetherstream",
      isFactionTech: true,
    },
    {
      nsidName: "ai-development-algorithm",
      name: "AI Development Algorithm",
      color: "red",
      prerequisites: {},
      abbr: "AI Dev Algo",
    },
    {
      nsidName: "biostims",
      name: "Bio-Stims",
      color: "green",
      prerequisites: { green: 1 },
      abbr: "Bio-Stims",
    },
    {
      nsidName: "crimson-legionnaire-2",
      name: "Crimsom Legionnaire II",
      color: "unit-upgrade",
      prerequisites: { green: 2 },
      abbr: "Crimson Legin II",
      isFactionTech: true,
      replacesNsidName: "infantry-2",
    },
    {
      nsidName: "dark-energy-tap",
      name: "Dark Energy Tap",
      color: "blue",
      prerequisites: {},
      abbr: "Dark Energy Tap",
    },
    {
      nsidName: "dimensional-tear-2",
      name: "Dimensional Tear II",
      color: "unit-upgrade",
      prerequisites: { yellow: 2 },
      abbr: "Dim Tear II",
      isFactionTech: true,
      replacesNsidName: "space-dock-2",
    },
    {
      nsidName: "genetic-recombination",
      name: "Genetic Recombination",
      color: "green",
      prerequisites: { green: 1 },
      abbr: "Gene Recomb",
      isFactionTech: true,
    },
    {
      nsidName: "hel-titan-2",
      name: "Hel Titan II",
      color: "unit-upgrade",
      prerequisites: { red: 1, yellow: 1 },
      abbr: "Hel-Titan II",
      isFactionTech: true,
      replacesNsidName: "pds-2",
    },
    {
      nsidName: "memoria-2",
      name: "Memoria II",
      color: "unit-upgrade",
      prerequisites: { green: 1, blue: 1, yellow: 1 },
      abbr: "Memoria II",
      isFactionTech: true,
      replacesNsidName: "flagship-2",
    },
    {
      nsidName: "pre-fab-arcologies",
      name: "Pre-Fab Arcologies",
      color: "green",
      prerequisites: { green: 3 },
      abbr: "Pre-Fab Arc",
      isFactionTech: true,
    },
    {
      nsidName: "predictive-intelligence",
      name: "Predictive Intelligence",
      color: "yellow",
      prerequisites: { yellow: 1 },
      abbr: "Pred Intel",
    },
    {
      nsidName: "psychoarchaeology",
      name: "Psychoarchaeology",
      color: "green",
      prerequisites: {},
      abbr: "Pyschoarch",
    },
    {
      nsidName: "saturn-engine-2",
      name: "Saturn Engine II",
      color: "unit-upgrade",
      prerequisites: { red: 1, green: 1, yellow: 1 },
      abbr: "Sat Eng II",
      isFactionTech: true,
      replacesNsidName: "cruiser-2",
    },
    {
      nsidName: "scanlink-drone-network",
      name: "Scanlink Drone Network",
      color: "yellow",
      prerequisites: {},
      abbr: "Scanlink",
    },
    {
      nsidName: "self-assembly-routines",
      name: "Self Assembly Routines",
      color: "red",
      prerequisites: { red: 1 },
      abbr: "Self Assembly",
    },
    {
      nsidName: "sling-relay",
      name: "Sling Relay",
      color: "blue",
      prerequisites: { blue: 1 },
      abbr: "Sling Relay",
    },
    {
      nsidName: "strike-wing-alpha-2",
      name: "Strike Wing Alpha II",
      color: "unit-upgrade",
      prerequisites: { red: 2 },
      abbr: "Strike Wing II",
      isFactionTech: true,
      replacesNsidName: "destroyer-2",
    },
    {
      nsidName: "supercharge",
      name: "Supercharge",
      color: "red",
      prerequisites: { red: 1 },
      abbr: "Supercharge",
      isFactionTech: true,
    },
    {
      nsidName: "temporal-command-suite",
      name: "Temporal Command Suite",
      color: "yellow",
      prerequisites: { yellow: 1 },
      abbr: "Temp Cmd Suite",
      isFactionTech: true,
    },
    {
      nsidName: "voidwatch",
      name: "Voidwatch",
      color: "green",
      prerequisites: { green: 1 },
      abbr: "Voidwatch",
      isFactionTech: true,
    },
    {
      nsidName: "vortex",
      name: "Vortex",
      color: "red",
      prerequisites: { red: 1 },
      abbr: "Vortex",
      isFactionTech: true,
    },
  ],
  "codex.ordinian": [
    {
      nsidName: "magen-defense-grid.omega",
      name: "Magen Defense Grid (Ω)",
      color: "red",
      prerequisites: { red: 1 },
      abbr: "Magen",
    },
    {
      nsidName: "magmus-reactor.omega",
      name: "Magmus Reactor (Ω)",
      color: "red",
      prerequisites: { red: 2 },
      abbr: "Magmus",
      isFactionTech: true,
    },
    {
      nsidName: "wormhole-generator.omega",
      name: "Wormhole Generator (Ω)",
      color: "blue",
      prerequisites: { blue: 2 },
      abbr: "Wormhole Gen",
      isFactionTech: true,
    },
    {
      nsidName: "x89-bacterial-weapon.omega",
      name: "X-89 Bacterial Weapon (Ω)",
      color: "green",
      prerequisites: { green: 3 },
      abbr: "X-89 B.W.",
    },
    {
      nsidName: "yin-spinner.omega",
      name: "Yin Spinner (Ω)",
      color: "green",
      prerequisites: { green: 2 },
      abbr: "Yin Spin",
      isFactionTech: true,
    },
  ],
  "codex.vigil": [
    {
      nsidName: "agency-supply-network",
      name: "Agency Supply Network",
      color: "yellow",
      prerequisites: { yellow: 2 },
      abbr: "Agency Supply",
      isFactionTech: true,
    },
    {
      nsidName: "iihq-modernization",
      name: "I.I.H.Q. Modernization",
      color: "yellow",
      prerequisites: { yellow: 1 },
      abbr: "IIQH Modern",
      isFactionTech: true,
    },
  ],
  "codex.liberation": [
    {
      nsidName: "magen-defense-grid",
      name: "Magen Defense Grid",
      color: "red",
      prerequisites: { red: 1 },
      abbr: "Magen",
    },
    {
      nsidName: "x89-bacterial-weapon",
      name: "X-89 Bacterial Weapon",
      color: "green",
      prerequisites: { green: 3 },
      abbr: "X-89 B.W.",
    },
  ],
};
