import { z } from "zod";
import {
  AnomalySchema,
  WormholeSchema,
  WormholeWithPositionSchema,
  HyperlaneSchema,
  SystemClassSchema,
} from "./basic-types-schema";
import { PlanetSchema } from "./planet-schema";

export const SystemSchema = z
  .object({
    tile: z.number(), // NSID "tile.system:${source}/${tile}"

    // "map" items are adjacent to other "map" items.
    // "offMap" items are never adjacent to any others (except by wormholes).
    class: SystemClassSchema.optional(),

    // "map" class but not eligible for drafting, e.g. Muaat hero system.
    isExcludeFromDraft: z.boolean().optional(),

    isHome: z.boolean().optional(),
    isHyperlane: z.boolean().optional(),
    anomalies: z.array(AnomalySchema).optional(),
    wormholes: z.array(WormholeSchema).optional(),
    wormholesFaceDown: z.array(WormholeSchema).optional(),

    // Some systems have wormholes in non-standard positions.
    // Wormhole nexus changes wormholes when flipped.
    wormholesWithPositions: z.array(WormholeWithPositionSchema).optional(),
    wormholesWithPositionsFaceDown: z
      .array(WormholeWithPositionSchema)
      .optional(),

    hyperlanes: HyperlaneSchema.optional(),
    hyperlanesFaceDown: HyperlaneSchema.optional(),

    planets: z.array(PlanetSchema).optional(),
    planetsFaceDown: z.array(PlanetSchema).optional(),

    // System tile image, PNG transparent square, fill to left/right edge.
    imgFaceDown: z.boolean().optional(), // has a custom back image

    ingress: z.boolean().optional(),
    egress: z.boolean().optional(),
  })
  .strict()
  .readonly();

export type SystemSchemaType = z.infer<typeof SystemSchema>;
