import { z } from "zod";
export declare const SystemSchema: z.ZodReadonly<z.ZodObject<{
    tile: z.ZodNumber;
    class: z.ZodOptional<z.ZodReadonly<z.ZodEnum<["map", "off-map", "alt"]>>>;
    isExcludeFromDraft: z.ZodOptional<z.ZodBoolean>;
    isHome: z.ZodOptional<z.ZodBoolean>;
    isHyperlane: z.ZodOptional<z.ZodBoolean>;
    anomalies: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "supernova"]>>, "many">>;
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
        localPosition: Readonly<{
            x: number;
            y: number;
        }>;
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
        localPosition: Readonly<{
            x: number;
            y: number;
        }>;
    }>>, "many">>;
    hyperlanes: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        n: z.ZodOptional<z.ZodArray<z.ZodEnum<["ne", "se", "s", "sw", "nw"]>, "many">>;
        ne: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "se", "s", "sw", "nw"]>, "many">>;
        se: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "s", "sw", "nw"]>, "many">>;
        s: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "sw", "nw"]>, "many">>;
        sw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
        nw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
    }, "strict", z.ZodTypeAny, {
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
    }, {
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
    }>>>;
    hyperlanesFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        n: z.ZodOptional<z.ZodArray<z.ZodEnum<["ne", "se", "s", "sw", "nw"]>, "many">>;
        ne: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "se", "s", "sw", "nw"]>, "many">>;
        se: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "s", "sw", "nw"]>, "many">>;
        s: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "sw", "nw"]>, "many">>;
        sw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
        nw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
    }, "strict", z.ZodTypeAny, {
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
    }, {
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
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
        legendaryNsidName?: string | undefined;
    }, {
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
        legendaryNsidName?: string | undefined;
    }>>, "many">>;
    imgFaceDown: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    tile: number;
    class?: "map" | "off-map" | "alt" | undefined;
    isExcludeFromDraft?: boolean | undefined;
    isHome?: boolean | undefined;
    isHyperlane?: boolean | undefined;
    anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "supernova")[] | undefined;
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
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
    }> | undefined;
    hyperlanesFaceDown?: Readonly<{
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
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
        legendaryNsidName?: string | undefined;
    }>[] | undefined;
    imgFaceDown?: boolean | undefined;
}, {
    tile: number;
    class?: "map" | "off-map" | "alt" | undefined;
    isExcludeFromDraft?: boolean | undefined;
    isHome?: boolean | undefined;
    isHyperlane?: boolean | undefined;
    anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "supernova")[] | undefined;
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
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
    }> | undefined;
    hyperlanesFaceDown?: Readonly<{
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
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
        legendaryNsidName?: string | undefined;
    }>[] | undefined;
    imgFaceDown?: boolean | undefined;
}>>;
export type SystemSchemaType = z.infer<typeof SystemSchema>;
