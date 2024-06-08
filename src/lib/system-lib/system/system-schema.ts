import { z } from "zod";
import { PlanetEntitySchema } from "../planet-entity/planet-entity-schema";
import { SystemEntitySchema } from "../system-entity/system-entity-schema";

export const SystemSchema = SystemEntitySchema.extend({
  tile: z.number(),
  class: z.enum(["map", "offMap"]).default("map"),
  img: z.string(),
  imgPackageId: z.string(),
  isHome: z.boolean().optional(),
  isHyperlane: z.boolean().optional(),
  planets: z.array(PlanetEntitySchema).optional(),
}).strict();

export type SystemSchemaType = z.infer<typeof SystemSchema>;
