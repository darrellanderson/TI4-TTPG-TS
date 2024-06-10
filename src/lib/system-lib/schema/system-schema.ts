import { z } from "zod";
import {
  AnomalySchema,
  WormholeSchema,
  WormholeWithPositionSchema,
  HyperlaneSchema,
} from "./basic-types-schema";

export const SystemSchema = z
  .object({
    tile: z.number(),

    // "map" items are adjacent to other "map" items.
    // "offMap" items are never adjacent to any others (except by wormholes).
    class: z.enum(["map", "offMap"]).optional(),

    isHome: z.boolean().optional(),
    isHyperlane: z.boolean().optional(),
    anomalies: z.array(AnomalySchema).optional(),
    wormholes: z.array(WormholeSchema).optional(),

    // Some systems have wormholes in non-standard positions.
    // Wormhole nexus changes wormholes when flipped.
    wormholesWithPositions: z.array(WormholeWithPositionSchema).optional(),
    wormholesWithPositionsFaceDown: z
      .array(WormholeWithPositionSchema)
      .optional(),

    hyperlanes: HyperlaneSchema.optional(),
    hyperlanesFaceDown: HyperlaneSchema.optional(),

    // System tile image, PNG transparent square, fill to left/right edge.
    img: z.string().optional(),
    imgPackageId: z.string().optional(),
  })
  .strict()
  .readonly();

export type SystemSchemaType = z.infer<typeof SystemSchema>;
