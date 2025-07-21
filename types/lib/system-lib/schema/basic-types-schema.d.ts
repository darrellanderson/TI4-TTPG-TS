import { z } from "zod";
export declare const AnomalySchema: z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "supernova"]>>;
export type AnomalySchemaType = z.infer<typeof AnomalySchema>;
/**
 * Connect edge to set of edges.
 */
export declare const HyperlaneSchema: z.ZodReadonly<z.ZodObject<{
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
}>>;
export type HyperlaneSchemaType = z.infer<typeof HyperlaneSchema>;
export declare const LocalPositionSchema: z.ZodReadonly<z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>>;
export type LocalPositionSchemaType = z.infer<typeof LocalPositionSchema>;
export declare const NsidNameSchema: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
export type NsidNameSchemaType = z.infer<typeof NsidNameSchema>;
export declare const SourceAndPackageIdSchema: z.ZodReadonly<z.ZodObject<{
    source: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
    packageId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    source: string;
    packageId: string;
}, {
    source: string;
    packageId: string;
}>>;
export type SourceAndPackageIdSchemaType = z.infer<typeof SourceAndPackageIdSchema>;
export declare const SystemClassSchema: z.ZodReadonly<z.ZodEnum<["map", "off-map", "alt"]>>;
export type SystemClassSchemaType = z.infer<typeof SystemClassSchema>;
export declare const PlanetTechSchema: z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>;
export type PlanetTechSchemaType = z.infer<typeof PlanetTechSchema>;
export declare const TraitSchema: z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>;
export type TraitSchemaType = z.infer<typeof TraitSchema>;
export declare const WormholeSchema: z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>;
export type WormholeSchemaType = z.infer<typeof WormholeSchema>;
export declare const WormholeWithPositionSchema: z.ZodReadonly<z.ZodObject<{
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
}>>;
export type WormholeWithPositionSchemaType = z.infer<typeof WormholeWithPositionSchema>;
