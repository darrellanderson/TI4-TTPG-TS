import { z } from "zod";
export declare const HomebrewModuleSchema: z.ZodObject<{
    sourceAndPackageId: z.ZodReadonly<z.ZodObject<{
        source: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        packageId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        source: string;
        packageId: string;
    }, {
        source: string;
        packageId: string;
    }>>;
    factions: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        name: z.ZodString;
        abbr: z.ZodString;
        abilities: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        breakthroughs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">>;
        commodities: z.ZodNumber;
        factionTechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        home: z.ZodNumber;
        homeSurrogate: z.ZodOptional<z.ZodNumber>;
        leaders: z.ZodReadonly<z.ZodObject<{
            agents: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
            commanders: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
            heroes: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
            mechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        }, "strict", z.ZodTypeAny, {
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }, {
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }>>;
        promissories: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        startingTechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        startingUnits: z.ZodReadonly<z.ZodObject<{
            carrier: z.ZodOptional<z.ZodNumber>;
            cruiser: z.ZodOptional<z.ZodNumber>;
            destroyer: z.ZodOptional<z.ZodNumber>;
            dreadnought: z.ZodOptional<z.ZodNumber>;
            fighter: z.ZodOptional<z.ZodNumber>;
            flagship: z.ZodOptional<z.ZodNumber>;
            infantry: z.ZodOptional<z.ZodNumber>;
            mech: z.ZodOptional<z.ZodNumber>;
            pds: z.ZodOptional<z.ZodNumber>;
            spaceDock: z.ZodOptional<z.ZodNumber>;
            warSun: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }, {
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }>>;
        unitOverrides: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        extras: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            nsid: z.ZodString;
            count: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            nsid: string;
            count?: number | undefined;
        }, {
            nsid: string;
            count?: number | undefined;
        }>>, "many">>;
        isExcludeFromDraft: z.ZodOptional<z.ZodBoolean>;
        skipFactionReferenceCard: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        abbr: string;
        abilities: string[];
        commodities: number;
        factionTechs: string[];
        home: number;
        leaders: Readonly<{
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }>;
        promissories: string[];
        startingTechs: string[];
        startingUnits: Readonly<{
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }>;
        unitOverrides: string[];
        breakthroughs?: string[] | undefined;
        homeSurrogate?: number | undefined;
        extras?: Readonly<{
            nsid: string;
            count?: number | undefined;
        }>[] | undefined;
        isExcludeFromDraft?: boolean | undefined;
        skipFactionReferenceCard?: boolean | undefined;
    }, {
        name: string;
        nsidName: string;
        abbr: string;
        abilities: string[];
        commodities: number;
        factionTechs: string[];
        home: number;
        leaders: {
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        };
        promissories: string[];
        startingTechs: string[];
        startingUnits: {
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        };
        unitOverrides: string[];
        breakthroughs?: string[] | undefined;
        homeSurrogate?: number | undefined;
        extras?: {
            nsid: string;
            count?: number | undefined;
        }[] | undefined;
        isExcludeFromDraft?: boolean | undefined;
        skipFactionReferenceCard?: boolean | undefined;
    }>>, "many">>;
    systems: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        tile: z.ZodNumber;
        class: z.ZodOptional<z.ZodReadonly<z.ZodEnum<["map", "off-map", "fracture", "alt"]>>>;
        isExcludeFromDraft: z.ZodOptional<z.ZodBoolean>;
        isHome: z.ZodOptional<z.ZodBoolean>;
        isHyperlane: z.ZodOptional<z.ZodBoolean>;
        anomalies: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "scar", "supernova"]>>, "many">>;
        wormholes: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        wormholesFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        wormholesWithPositions: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            wormhole: z.ZodString;
            localPosition: z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
        }, "strict", z.ZodTypeAny, {
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }, {
            wormhole: string;
            localPosition: {
                x: number;
                y: number;
            };
        }>>, "many">>;
        wormholesWithPositionsFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            wormhole: z.ZodString;
            localPosition: z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
        }, "strict", z.ZodTypeAny, {
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }, {
            wormhole: string;
            localPosition: {
                x: number;
                y: number;
            };
        }>>, "many">>;
        hyperlanes: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            n: z.ZodOptional<z.ZodArray<z.ZodEnum<["ne", "se", "s", "sw", "nw"]>, "many">>;
            ne: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "se", "s", "sw", "nw"]>, "many">>;
            se: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "s", "sw", "nw"]>, "many">>;
            s: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "sw", "nw"]>, "many">>;
            sw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
            nw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
        }, "strict", z.ZodTypeAny, {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }, {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }>>>;
        hyperlanesFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            n: z.ZodOptional<z.ZodArray<z.ZodEnum<["ne", "se", "s", "sw", "nw"]>, "many">>;
            ne: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "se", "s", "sw", "nw"]>, "many">>;
            se: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "s", "sw", "nw"]>, "many">>;
            s: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "sw", "nw"]>, "many">>;
            sw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
            nw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
        }, "strict", z.ZodTypeAny, {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }, {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }>>>;
        planets: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            name: z.ZodString;
            nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
            localPosition: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            localPositionFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            radius: z.ZodOptional<z.ZodNumber>;
            influence: z.ZodOptional<z.ZodNumber>;
            resources: z.ZodOptional<z.ZodNumber>;
            techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
            traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
            isLegendary: z.ZodOptional<z.ZodBoolean>;
            isSpaceStation: z.ZodOptional<z.ZodBoolean>;
            legendaryNsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }, {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>>, "many">>;
        planetsFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            name: z.ZodString;
            nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
            localPosition: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            localPositionFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            radius: z.ZodOptional<z.ZodNumber>;
            influence: z.ZodOptional<z.ZodNumber>;
            resources: z.ZodOptional<z.ZodNumber>;
            techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
            traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
            isLegendary: z.ZodOptional<z.ZodBoolean>;
            isSpaceStation: z.ZodOptional<z.ZodBoolean>;
            legendaryNsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }, {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>>, "many">>;
        imgFaceDown: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        tile: number;
        class?: "map" | "off-map" | "fracture" | "alt" | undefined;
        isExcludeFromDraft?: boolean | undefined;
        isHome?: boolean | undefined;
        isHyperlane?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesWithPositions?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        wormholesWithPositionsFaceDown?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        hyperlanes?: Readonly<{
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }> | undefined;
        hyperlanesFaceDown?: Readonly<{
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }> | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        planetsFaceDown?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        imgFaceDown?: boolean | undefined;
    }, {
        tile: number;
        class?: "map" | "off-map" | "fracture" | "alt" | undefined;
        isExcludeFromDraft?: boolean | undefined;
        isHome?: boolean | undefined;
        isHyperlane?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesWithPositions?: {
            wormhole: string;
            localPosition: {
                x: number;
                y: number;
            };
        }[] | undefined;
        wormholesWithPositionsFaceDown?: {
            wormhole: string;
            localPosition: {
                x: number;
                y: number;
            };
        }[] | undefined;
        hyperlanes?: {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        } | undefined;
        hyperlanesFaceDown?: {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        } | undefined;
        planets?: {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }[] | undefined;
        planetsFaceDown?: {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }[] | undefined;
        imgFaceDown?: boolean | undefined;
    }>>, "many">>;
    planetAttachments: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        imgFaceDown: z.ZodOptional<z.ZodBoolean>;
        doNotAttach: z.ZodOptional<z.ZodBoolean>;
        influence: z.ZodOptional<z.ZodNumber>;
        influenceFaceDown: z.ZodOptional<z.ZodNumber>;
        resources: z.ZodOptional<z.ZodNumber>;
        resourcesFaceDown: z.ZodOptional<z.ZodNumber>;
        techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
        techsFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
        traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
        traitsFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
        isLegendary: z.ZodOptional<z.ZodBoolean>;
        legendaryNsidName: z.ZodOptional<z.ZodString>;
        isDestroyPlanet: z.ZodOptional<z.ZodBoolean>;
        flipIfNoPlanetTech: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        influence?: number | undefined;
        influenceFaceDown?: number | undefined;
        resources?: number | undefined;
        resourcesFaceDown?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        techsFaceDown?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        traitsFaceDown?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
        isDestroyPlanet?: boolean | undefined;
        flipIfNoPlanetTech?: boolean | undefined;
    }, {
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        influence?: number | undefined;
        influenceFaceDown?: number | undefined;
        resources?: number | undefined;
        resourcesFaceDown?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        techsFaceDown?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        traitsFaceDown?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
        isDestroyPlanet?: boolean | undefined;
        flipIfNoPlanetTech?: boolean | undefined;
    }>>, "many">>;
    systemAttachments: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        imgFaceDown: z.ZodOptional<z.ZodBoolean>;
        doNotAttach: z.ZodOptional<z.ZodBoolean>;
        anomalies: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "scar", "supernova"]>>, "many">>;
        wormholes: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        wormholesFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        isDestroyWormhole: z.ZodOptional<z.ZodBoolean>;
        planets: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            name: z.ZodString;
            nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
            localPosition: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            localPositionFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            radius: z.ZodOptional<z.ZodNumber>;
            influence: z.ZodOptional<z.ZodNumber>;
            resources: z.ZodOptional<z.ZodNumber>;
            techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
            traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
            isLegendary: z.ZodOptional<z.ZodBoolean>;
            isSpaceStation: z.ZodOptional<z.ZodBoolean>;
            legendaryNsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }, {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>>, "many">>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        isDestroyWormhole?: boolean | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
    }, {
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        isDestroyWormhole?: boolean | undefined;
        planets?: {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }[] | undefined;
    }>>, "many">>;
    unitAttrs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        unit: z.ZodReadonly<z.ZodEnum<["carrier", "control-token", "cruiser", "destroyer", "dreadnought", "fighter", "flagship", "galvanize-token", "infantry", "mech", "pds", "space-dock", "war-sun"]>>;
        componentCount: z.ZodOptional<z.ZodNumber>;
        diceColor: z.ZodOptional<z.ZodString>;
        nsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        overrideNsid: z.ZodOptional<z.ZodString>;
        cost: z.ZodOptional<z.ZodNumber>;
        producePerCost: z.ZodOptional<z.ZodNumber>;
        isShip: z.ZodOptional<z.ZodBoolean>;
        isGround: z.ZodOptional<z.ZodBoolean>;
        hasSustainDamage: z.ZodOptional<z.ZodBoolean>;
        hasPlanetaryShield: z.ZodOptional<z.ZodBoolean>;
        disablePlanetaryShield: z.ZodOptional<z.ZodBoolean>;
        antiFighterBarrage: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        bombardment: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        spaceCannon: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        spaceCombat: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        groundCombat: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        afbDestroyInfantryInSpace: z.ZodOptional<z.ZodNumber>;
        onlyIfFaceDown: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "galvanize-token" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
        componentCount?: number | undefined;
        diceColor?: string | undefined;
        nsidName?: string | undefined;
        overrideNsid?: string | undefined;
        cost?: number | undefined;
        producePerCost?: number | undefined;
        isShip?: boolean | undefined;
        isGround?: boolean | undefined;
        hasSustainDamage?: boolean | undefined;
        hasPlanetaryShield?: boolean | undefined;
        disablePlanetaryShield?: boolean | undefined;
        antiFighterBarrage?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        bombardment?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCannon?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        groundCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        afbDestroyInfantryInSpace?: number | undefined;
        onlyIfFaceDown?: boolean | undefined;
    }, {
        name: string;
        unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "galvanize-token" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
        componentCount?: number | undefined;
        diceColor?: string | undefined;
        nsidName?: string | undefined;
        overrideNsid?: string | undefined;
        cost?: number | undefined;
        producePerCost?: number | undefined;
        isShip?: boolean | undefined;
        isGround?: boolean | undefined;
        hasSustainDamage?: boolean | undefined;
        hasPlanetaryShield?: boolean | undefined;
        disablePlanetaryShield?: boolean | undefined;
        antiFighterBarrage?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        bombardment?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        spaceCannon?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        spaceCombat?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        groundCombat?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        afbDestroyInfantryInSpace?: number | undefined;
        onlyIfFaceDown?: boolean | undefined;
    }>>, "many">>;
    unitModifiers: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        triggerAlways: z.ZodOptional<z.ZodBoolean>;
        triggers: z.ZodArray<z.ZodReadonly<z.ZodObject<{
            cardClass: z.ZodReadonly<z.ZodEnum<["action", "agenda", "agent", "alliance", "breakthrough", "commander", "event", "faction-ability", "hero", "legendary", "mech", "promissory", "relic", "technology.blue", "technology.green", "technology.red", "technology.yellow", "technology.unit-upgrade", "unit"]>>;
            nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
            overrideSource: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        }, "strict", z.ZodTypeAny, {
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "breakthrough" | "commander" | "event" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }, {
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "breakthrough" | "commander" | "event" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }>>, "many">;
        isActiveIdle: z.ZodOptional<z.ZodBoolean>;
        owner: z.ZodReadonly<z.ZodEnum<["self", "opponent", "any"]>>;
        priority: z.ZodReadonly<z.ZodEnum<["mutate", "mutate-late", "adjust", "adjust-late", "choose"]>>;
        applies: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodBoolean>;
        apply: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodVoid>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        description: string;
        triggers: Readonly<{
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "breakthrough" | "commander" | "event" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }>[];
        owner: "self" | "opponent" | "any";
        priority: "mutate" | "mutate-late" | "adjust" | "adjust-late" | "choose";
        applies: (args_0: any, ...args: unknown[]) => boolean;
        apply: (args_0: any, ...args: unknown[]) => void;
        triggerAlways?: boolean | undefined;
        isActiveIdle?: boolean | undefined;
    }, {
        name: string;
        description: string;
        triggers: {
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "breakthrough" | "commander" | "event" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }[];
        owner: "self" | "opponent" | "any";
        priority: "mutate" | "mutate-late" | "adjust" | "adjust-late" | "choose";
        applies: (args_0: any, ...args: unknown[]) => boolean;
        apply: (args_0: any, ...args: unknown[]) => void;
        triggerAlways?: boolean | undefined;
        isActiveIdle?: boolean | undefined;
    }>>, "many">>;
    technologies: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        name: z.ZodString;
        abbr: z.ZodOptional<z.ZodString>;
        color: z.ZodEnum<["blue", "green", "red", "yellow", "unit-upgrade", "none"]>;
        prerequisites: z.ZodObject<{
            blue: z.ZodOptional<z.ZodNumber>;
            green: z.ZodOptional<z.ZodNumber>;
            red: z.ZodOptional<z.ZodNumber>;
            yellow: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        }, {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        }>;
        isFactionTech: z.ZodOptional<z.ZodBoolean>;
        replacesNsidName: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
        prerequisites: {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        };
        abbr?: string | undefined;
        isFactionTech?: boolean | undefined;
        replacesNsidName?: string | undefined;
    }, {
        name: string;
        nsidName: string;
        color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
        prerequisites: {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        };
        abbr?: string | undefined;
        isFactionTech?: boolean | undefined;
        replacesNsidName?: string | undefined;
    }>>, "many">>;
    remove: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    nsidToTemplateId: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    sourceAndPackageId: Readonly<{
        source: string;
        packageId: string;
    }>;
    factions?: Readonly<{
        name: string;
        nsidName: string;
        abbr: string;
        abilities: string[];
        commodities: number;
        factionTechs: string[];
        home: number;
        leaders: Readonly<{
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }>;
        promissories: string[];
        startingTechs: string[];
        startingUnits: Readonly<{
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }>;
        unitOverrides: string[];
        breakthroughs?: string[] | undefined;
        homeSurrogate?: number | undefined;
        extras?: Readonly<{
            nsid: string;
            count?: number | undefined;
        }>[] | undefined;
        isExcludeFromDraft?: boolean | undefined;
        skipFactionReferenceCard?: boolean | undefined;
    }>[] | undefined;
    systems?: Readonly<{
        tile: number;
        class?: "map" | "off-map" | "fracture" | "alt" | undefined;
        isExcludeFromDraft?: boolean | undefined;
        isHome?: boolean | undefined;
        isHyperlane?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesWithPositions?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        wormholesWithPositionsFaceDown?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        hyperlanes?: Readonly<{
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }> | undefined;
        hyperlanesFaceDown?: Readonly<{
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }> | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        planetsFaceDown?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        imgFaceDown?: boolean | undefined;
    }>[] | undefined;
    planetAttachments?: Readonly<{
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        influence?: number | undefined;
        influenceFaceDown?: number | undefined;
        resources?: number | undefined;
        resourcesFaceDown?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        techsFaceDown?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        traitsFaceDown?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
        isDestroyPlanet?: boolean | undefined;
        flipIfNoPlanetTech?: boolean | undefined;
    }>[] | undefined;
    systemAttachments?: Readonly<{
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        isDestroyWormhole?: boolean | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
    }>[] | undefined;
    unitAttrs?: Readonly<{
        name: string;
        unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "galvanize-token" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
        componentCount?: number | undefined;
        diceColor?: string | undefined;
        nsidName?: string | undefined;
        overrideNsid?: string | undefined;
        cost?: number | undefined;
        producePerCost?: number | undefined;
        isShip?: boolean | undefined;
        isGround?: boolean | undefined;
        hasSustainDamage?: boolean | undefined;
        hasPlanetaryShield?: boolean | undefined;
        disablePlanetaryShield?: boolean | undefined;
        antiFighterBarrage?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        bombardment?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCannon?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        groundCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        afbDestroyInfantryInSpace?: number | undefined;
        onlyIfFaceDown?: boolean | undefined;
    }>[] | undefined;
    unitModifiers?: Readonly<{
        name: string;
        description: string;
        triggers: Readonly<{
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "breakthrough" | "commander" | "event" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }>[];
        owner: "self" | "opponent" | "any";
        priority: "mutate" | "mutate-late" | "adjust" | "adjust-late" | "choose";
        applies: (args_0: any, ...args: unknown[]) => boolean;
        apply: (args_0: any, ...args: unknown[]) => void;
        triggerAlways?: boolean | undefined;
        isActiveIdle?: boolean | undefined;
    }>[] | undefined;
    technologies?: Readonly<{
        name: string;
        nsidName: string;
        color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
        prerequisites: {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        };
        abbr?: string | undefined;
        isFactionTech?: boolean | undefined;
        replacesNsidName?: string | undefined;
    }>[] | undefined;
    remove?: string[] | undefined;
    nsidToTemplateId?: Record<string, string> | undefined;
}, {
    sourceAndPackageId: {
        source: string;
        packageId: string;
    };
    factions?: {
        name: string;
        nsidName: string;
        abbr: string;
        abilities: string[];
        commodities: number;
        factionTechs: string[];
        home: number;
        leaders: {
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        };
        promissories: string[];
        startingTechs: string[];
        startingUnits: {
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        };
        unitOverrides: string[];
        breakthroughs?: string[] | undefined;
        homeSurrogate?: number | undefined;
        extras?: {
            nsid: string;
            count?: number | undefined;
        }[] | undefined;
        isExcludeFromDraft?: boolean | undefined;
        skipFactionReferenceCard?: boolean | undefined;
    }[] | undefined;
    systems?: {
        tile: number;
        class?: "map" | "off-map" | "fracture" | "alt" | undefined;
        isExcludeFromDraft?: boolean | undefined;
        isHome?: boolean | undefined;
        isHyperlane?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesWithPositions?: {
            wormhole: string;
            localPosition: {
                x: number;
                y: number;
            };
        }[] | undefined;
        wormholesWithPositionsFaceDown?: {
            wormhole: string;
            localPosition: {
                x: number;
                y: number;
            };
        }[] | undefined;
        hyperlanes?: {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        } | undefined;
        hyperlanesFaceDown?: {
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        } | undefined;
        planets?: {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }[] | undefined;
        planetsFaceDown?: {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }[] | undefined;
        imgFaceDown?: boolean | undefined;
    }[] | undefined;
    planetAttachments?: {
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        influence?: number | undefined;
        influenceFaceDown?: number | undefined;
        resources?: number | undefined;
        resourcesFaceDown?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        techsFaceDown?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        traitsFaceDown?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
        isDestroyPlanet?: boolean | undefined;
        flipIfNoPlanetTech?: boolean | undefined;
    }[] | undefined;
    systemAttachments?: {
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        isDestroyWormhole?: boolean | undefined;
        planets?: {
            name: string;
            nsidName: string;
            localPosition?: {
                x: number;
                y: number;
            } | undefined;
            localPositionFaceDown?: {
                x: number;
                y: number;
            } | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }[] | undefined;
    }[] | undefined;
    unitAttrs?: {
        name: string;
        unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "galvanize-token" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
        componentCount?: number | undefined;
        diceColor?: string | undefined;
        nsidName?: string | undefined;
        overrideNsid?: string | undefined;
        cost?: number | undefined;
        producePerCost?: number | undefined;
        isShip?: boolean | undefined;
        isGround?: boolean | undefined;
        hasSustainDamage?: boolean | undefined;
        hasPlanetaryShield?: boolean | undefined;
        disablePlanetaryShield?: boolean | undefined;
        antiFighterBarrage?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        bombardment?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        spaceCannon?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        spaceCombat?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        groundCombat?: {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        } | undefined;
        afbDestroyInfantryInSpace?: number | undefined;
        onlyIfFaceDown?: boolean | undefined;
    }[] | undefined;
    unitModifiers?: {
        name: string;
        description: string;
        triggers: {
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "breakthrough" | "commander" | "event" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }[];
        owner: "self" | "opponent" | "any";
        priority: "mutate" | "mutate-late" | "adjust" | "adjust-late" | "choose";
        applies: (args_0: any, ...args: unknown[]) => boolean;
        apply: (args_0: any, ...args: unknown[]) => void;
        triggerAlways?: boolean | undefined;
        isActiveIdle?: boolean | undefined;
    }[] | undefined;
    technologies?: {
        name: string;
        nsidName: string;
        color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
        prerequisites: {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        };
        abbr?: string | undefined;
        isFactionTech?: boolean | undefined;
        replacesNsidName?: string | undefined;
    }[] | undefined;
    remove?: string[] | undefined;
    nsidToTemplateId?: Record<string, string> | undefined;
}>;
export type HomebrewModuleType = z.infer<typeof HomebrewModuleSchema>;
export declare function validateHomebrewModule(homebrew: HomebrewModuleType): {
    sourceAndPackageId: Readonly<{
        source: string;
        packageId: string;
    }>;
    factions?: Readonly<{
        name: string;
        nsidName: string;
        abbr: string;
        abilities: string[];
        commodities: number;
        factionTechs: string[];
        home: number;
        leaders: Readonly<{
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }>;
        promissories: string[];
        startingTechs: string[];
        startingUnits: Readonly<{
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }>;
        unitOverrides: string[];
        breakthroughs?: string[] | undefined;
        homeSurrogate?: number | undefined;
        extras?: Readonly<{
            nsid: string;
            count?: number | undefined;
        }>[] | undefined;
        isExcludeFromDraft?: boolean | undefined;
        skipFactionReferenceCard?: boolean | undefined;
    }>[] | undefined;
    systems?: Readonly<{
        tile: number;
        class?: "map" | "off-map" | "fracture" | "alt" | undefined;
        isExcludeFromDraft?: boolean | undefined;
        isHome?: boolean | undefined;
        isHyperlane?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesWithPositions?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        wormholesWithPositionsFaceDown?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        hyperlanes?: Readonly<{
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }> | undefined;
        hyperlanesFaceDown?: Readonly<{
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        }> | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        planetsFaceDown?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        imgFaceDown?: boolean | undefined;
    }>[] | undefined;
    planetAttachments?: Readonly<{
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        influence?: number | undefined;
        influenceFaceDown?: number | undefined;
        resources?: number | undefined;
        resourcesFaceDown?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        techsFaceDown?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        traitsFaceDown?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
        isDestroyPlanet?: boolean | undefined;
        flipIfNoPlanetTech?: boolean | undefined;
    }>[] | undefined;
    systemAttachments?: Readonly<{
        name: string;
        nsidName: string;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        isDestroyWormhole?: boolean | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            isSpaceStation?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
    }>[] | undefined;
    unitAttrs?: Readonly<{
        name: string;
        unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "galvanize-token" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
        componentCount?: number | undefined;
        diceColor?: string | undefined;
        nsidName?: string | undefined;
        overrideNsid?: string | undefined;
        cost?: number | undefined;
        producePerCost?: number | undefined;
        isShip?: boolean | undefined;
        isGround?: boolean | undefined;
        hasSustainDamage?: boolean | undefined;
        hasPlanetaryShield?: boolean | undefined;
        disablePlanetaryShield?: boolean | undefined;
        antiFighterBarrage?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        bombardment?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCannon?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        groundCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        afbDestroyInfantryInSpace?: number | undefined;
        onlyIfFaceDown?: boolean | undefined;
    }>[] | undefined;
    unitModifiers?: Readonly<{
        name: string;
        description: string;
        triggers: Readonly<{
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "breakthrough" | "commander" | "event" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }>[];
        owner: "self" | "opponent" | "any";
        priority: "mutate" | "mutate-late" | "adjust" | "adjust-late" | "choose";
        applies: (args_0: any, ...args: unknown[]) => boolean;
        apply: (args_0: any, ...args: unknown[]) => void;
        triggerAlways?: boolean | undefined;
        isActiveIdle?: boolean | undefined;
    }>[] | undefined;
    technologies?: Readonly<{
        name: string;
        nsidName: string;
        color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
        prerequisites: {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        };
        abbr?: string | undefined;
        isFactionTech?: boolean | undefined;
        replacesNsidName?: string | undefined;
    }>[] | undefined;
    remove?: string[] | undefined;
    nsidToTemplateId?: Record<string, string> | undefined;
};
