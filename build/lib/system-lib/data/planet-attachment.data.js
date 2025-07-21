"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOURCE_TO_PLANET_ATTACHMENT_DATA = void 0;
exports.SOURCE_TO_PLANET_ATTACHMENT_DATA = {
    pok: [
        {
            name: "Biotic Research Facility",
            nsidName: "biotic-research-facility",
            imgFaceDown: true,
            resources: 1,
            influence: 1,
            resourcesFaceDown: 0,
            influenceFaceDown: 0,
            techsFaceDown: ["green"],
            flipIfNoPlanetTech: true,
        },
        {
            name: "Cybernetic Research Facility",
            nsidName: "cybernetic-research-facility",
            imgFaceDown: true,
            resources: 1,
            influence: 1,
            resourcesFaceDown: 0,
            influenceFaceDown: 0,
            techsFaceDown: ["yellow"],
            flipIfNoPlanetTech: true,
        },
        {
            name: "Demilitarized Zone",
            nsidName: "demilitarized-zone",
        },
        {
            name: "Sleeper Token",
            nsidName: "sleeper-token",
            doNotAttach: true,
        },
        {
            name: "Stellar Converter",
            nsidName: "stellar-converter",
            isDestroyPlanet: true,
        },
        {
            name: "Dyson Sphere",
            nsidName: "dyson-sphere",
            resources: 2,
            influence: 1,
        },
        {
            // Unit modifier handles space cannon.
            name: "Geoform",
            nsidName: "geoform",
            resources: 3,
            influence: 3,
        },
        {
            name: "Lazax Survivors",
            nsidName: "lazax-survivors",
            resources: 1,
            influence: 2,
        },
        {
            name: "Mining World",
            nsidName: "mining-world",
            resources: 2,
        },
        {
            name: "Paradise World",
            nsidName: "paradise-world",
            influence: 2,
        },
        {
            name: "Propulsion Research Facility",
            nsidName: "propulsion-research-facility",
            imgFaceDown: true,
            resources: 1,
            influence: 1,
            resourcesFaceDown: 0,
            influenceFaceDown: 0,
            techsFaceDown: ["blue"],
            flipIfNoPlanetTech: true,
        },
        {
            name: "Rich World",
            nsidName: "rich-world",
            resources: 1,
        },
        {
            name: "Terraform",
            nsidName: "terraform",
            resources: 1,
            influence: 1,
            traits: ["industrial", "hazardous", "cultural"],
        },
        {
            name: "Tomb of Emphidia",
            nsidName: "tomb-of-emphidia",
            influence: 1,
        },
        {
            name: "Warfare Research Facility",
            nsidName: "warfare-research-facility",
            imgFaceDown: true,
            resources: 1,
            influence: 1,
            resourcesFaceDown: 0,
            influenceFaceDown: 0,
            techsFaceDown: ["red"],
            flipIfNoPlanetTech: true,
        },
    ],
    ["codex.affinity"]: [
        {
            name: "Nano Forge",
            nsidName: "nanoforge",
            resources: 2,
            influence: 2,
            isLegendary: true,
        },
    ],
    ["codex.vigil"]: [
        {
            // Unit modifier handles space cannon, checks token for face up.
            name: "Custodia Vigilia",
            nsidName: "custodia-vigilia",
        },
    ],
};
//# sourceMappingURL=planet-attachment.data.js.map