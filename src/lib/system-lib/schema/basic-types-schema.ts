import { z } from "zod";

export const AnomalySchema = z
  .enum(["asteroid-field", "gravity-rift", "nebula", "supernova"])
  .readonly();
export type AnomalySchemaType = z.infer<typeof AnomalySchema>;

/**
 * Connect edge to set of edges.
 */
export const HyperlaneSchema = z
  .object({
    n: z.array(z.enum(["ne", "se", "s", "sw", "nw"])).optional(),
    ne: z.array(z.enum(["n", "se", "s", "sw", "nw"])).optional(),
    se: z.array(z.enum(["n", "ne", "s", "sw", "nw"])).optional(),
    s: z.array(z.enum(["n", "ne", "se", "sw", "nw"])).optional(),
    sw: z.array(z.enum(["n", "ne", "se", "s", "nw"])).optional(),
    nw: z.array(z.enum(["n", "ne", "se", "s", "nw"])).optional(),
  })
  .strict()
  .readonly();
export type HyperlaneSchemaType = z.infer<typeof HyperlaneSchema>;

export const LocalPositionSchema = z
  .object({
    x: z.number(),
    y: z.number(),
  })
  .strict()
  .readonly();
export type LocalPositionSchemaType = z.infer<typeof LocalPositionSchema>;

export const NsidNameSchema = z
  .string()
  .min(1)
  .refine((value: string) => /^[a-z0-9\._-]+$/.test(value))
  .readonly();
export type NsidNameSchemaType = z.infer<typeof NsidNameSchema>;

export const SourceAndPackageIdSchema = z
  .object({
    source: NsidNameSchema,
    packageId: z.string(),
  })
  .strict()
  .readonly();
export type SourceAndPackageIdSchemaType = z.infer<
  typeof SourceAndPackageIdSchema
>;

export const SystemClassSchema = z.enum(["map", "off-map", "alt"]).readonly();
export type SystemClassSchemaType = z.infer<typeof SystemClassSchema>;

export const TechSchema = z.enum(["blue", "green", "red", "yellow"]).readonly();
export type TechSchemaType = z.infer<typeof TechSchema>;

export const TraitSchema = z
  .enum(["cultural", "hazardous", "industrial"])
  .readonly();
export type TraitSchemaType = z.infer<typeof TraitSchema>;

export const WormholeSchema = z
  .enum(["alpha", "beta", "gamma", "delta", "epsilon"])
  .readonly();
export type WormholeSchemaType = z.infer<typeof WormholeSchema>;

export const WormholeWithPositionSchema = z
  .object({
    wormhole: z.string(),
    localPosition: LocalPositionSchema,
  })
  .strict()
  .readonly();
export type WormholeWithPositionSchemaType = z.infer<
  typeof WormholeWithPositionSchema
>;
