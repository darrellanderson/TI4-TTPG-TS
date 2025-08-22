import { z } from "zod";
import {
  LocalPositionSchema,
  NsidNameSchema,
  PlanetTechSchema,
  TraitSchema,
} from "./basic-types-schema";

export const PlanetSchema = z
  .object({
    name: z.string().min(1),
    nsidName: NsidNameSchema, // card NSID "card.planet:${source}/${nsidName}"
    localPosition: LocalPositionSchema.optional(),
    localPositionFaceDown: LocalPositionSchema.optional(),
    radius: z.number().optional(),
    influence: z.number().optional(),
    resources: z.number().optional(),
    techs: z.array(PlanetTechSchema).optional(),
    traits: z.array(TraitSchema).optional(),
    isLegendary: z.boolean().optional(),
    isSpaceStation: z.boolean().optional(),
    legendaryNsidName: NsidNameSchema.optional(), // card NSID "card.legendary-planet:${source}/${legendaryNsidName}"
  })
  .strict()
  .readonly();

export type PlanetSchemaType = z.infer<typeof PlanetSchema>;
