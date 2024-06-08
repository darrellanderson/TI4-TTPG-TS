import { z } from "zod";
import { SystemEntitySchema } from "../system-entity/system-entity-schema";

export const PlanetEntitySchema = SystemEntitySchema.extend({
  influence: z.number().optional(),
  resources: z.number().optional(),
  traits: z.array(z.enum(["cultural", "hazardous", "industrial"])).optional(),
  techs: z.array(z.enum(["blue", "green", "red", "yellow"])).optional(),
  legendary: z.boolean().optional(),
  radius: z.number().optional(),
  destroyPlanet: z.boolean().optional(),
}).strict();

export type PlanetEntityType = z.infer<typeof PlanetEntitySchema>;
