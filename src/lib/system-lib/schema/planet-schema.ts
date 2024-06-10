import { z } from "zod";
import {
  LocalPositionSchema,
  TechSchema,
  TraitSchema,
} from "./basic-types-schema";

export const PlanetSchema = z
  .object({
    name: z.string(),
    offset: LocalPositionSchema.optional(),
    radius: z.number().optional(),
    influence: z.number().optional(),
    resources: z.number().optional(),
    techs: z.array(TechSchema).optional(),
    traits: z.array(TraitSchema).optional(),
    isLegendary: z.boolean().optional(),
    legendaryCardNsid: z.string().optional(),
  })
  .strict();

export type PlanetSchemaType = z.infer<typeof PlanetSchema>;
