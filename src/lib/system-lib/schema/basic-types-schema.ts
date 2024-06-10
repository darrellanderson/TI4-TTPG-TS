import { z } from "zod";

export const AnomalySchema = z.enum([
  "asteroid_field",
  "gravity_rift",
  "nebula",
  "supernova",
]);

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
  .strict();

export const LocalPositionSchema = z
  .object({
    x: z.number(),
    y: z.number(),
  })
  .strict();

export const TechSchema = z.enum(["blue", "green", "red", "yellow"]);

export const TraitSchema = z.enum(["cultural", "hazardous", "industrial"]);

export const WormholeSchema = z.enum(["alpha", "beta", "delta", "gamma"]);

export const WormholeWithPositionSchema = z
  .object({
    wormhole: z.string(),
    localPosition: LocalPositionSchema,
  })
  .strict();
