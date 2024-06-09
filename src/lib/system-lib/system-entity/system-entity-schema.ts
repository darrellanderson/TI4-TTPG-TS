import { z } from "zod";
import { PlanetEntitySchema } from "../planet-entity/planet-entity-schema";

/**
 * A system entity can describe a complete system tile, or a system attachment.
 * Planet and planet attachments are described by planet entity.
 */
export const SystemEntitySchema = z
  .object({
    // Human readable name.
    name: z.string(),

    // System tile, attachment token, etc.
    nsid: z.string().optional(),

    // Local position within the system tile.
    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .strict()
      .optional(),

    // "map" items are adjacent to other "map" items.
    // "offMap" items are never adjacent to any others (except by wormholes).
    class: z.enum(["map", "offMap"]).default("map").optional(),

    tile: z.number().optional(),
    isHome: z.boolean().optional(),
    isHyperlane: z.boolean().optional(),
    anomalies: z.array(z.string()).optional(),
    wormholes: z.array(z.string()).optional(),
    planets: z.array(PlanetEntitySchema).optional(),

    // System tile image, PNG transparent square, fill to left/right edge.
    img: z.string().optional(),
    imgPackageId: z.string().optional(),
  })
  .strict();

export type SystemEntityType = z.infer<typeof SystemEntitySchema>;
