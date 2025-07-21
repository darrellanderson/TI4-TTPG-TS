"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WormholeWithPositionSchema = exports.WormholeSchema = exports.TraitSchema = exports.PlanetTechSchema = exports.SystemClassSchema = exports.SourceAndPackageIdSchema = exports.NsidNameSchema = exports.LocalPositionSchema = exports.HyperlaneSchema = exports.AnomalySchema = void 0;
const zod_1 = require("zod");
exports.AnomalySchema = zod_1.z
    .enum(["asteroid-field", "gravity-rift", "nebula", "supernova"])
    .readonly();
/**
 * Connect edge to set of edges.
 */
exports.HyperlaneSchema = zod_1.z
    .object({
    n: zod_1.z.array(zod_1.z.enum(["ne", "se", "s", "sw", "nw"])).optional(),
    ne: zod_1.z.array(zod_1.z.enum(["n", "se", "s", "sw", "nw"])).optional(),
    se: zod_1.z.array(zod_1.z.enum(["n", "ne", "s", "sw", "nw"])).optional(),
    s: zod_1.z.array(zod_1.z.enum(["n", "ne", "se", "sw", "nw"])).optional(),
    sw: zod_1.z.array(zod_1.z.enum(["n", "ne", "se", "s", "nw"])).optional(),
    nw: zod_1.z.array(zod_1.z.enum(["n", "ne", "se", "s", "nw"])).optional(),
})
    .strict()
    .readonly();
exports.LocalPositionSchema = zod_1.z
    .object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
})
    .strict()
    .readonly();
exports.NsidNameSchema = zod_1.z
    .string()
    .min(1)
    .refine((value) => /^[a-z0-9._-]+$/.test(value))
    .readonly();
exports.SourceAndPackageIdSchema = zod_1.z
    .object({
    source: exports.NsidNameSchema,
    packageId: zod_1.z.string(),
})
    .strict()
    .readonly();
exports.SystemClassSchema = zod_1.z.enum(["map", "off-map", "alt"]).readonly();
exports.PlanetTechSchema = zod_1.z
    .enum(["blue", "green", "red", "yellow"])
    .readonly();
exports.TraitSchema = zod_1.z
    .enum(["cultural", "hazardous", "industrial"])
    .readonly();
exports.WormholeSchema = zod_1.z
    .enum(["alpha", "beta", "gamma", "delta", "epsilon"])
    .readonly();
exports.WormholeWithPositionSchema = zod_1.z
    .object({
    wormhole: zod_1.z.string(),
    localPosition: exports.LocalPositionSchema,
})
    .strict()
    .readonly();
//# sourceMappingURL=basic-types-schema.js.map