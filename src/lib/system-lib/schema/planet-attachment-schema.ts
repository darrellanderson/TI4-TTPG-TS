import { z } from "zod";
import { NsidNameSchema, TechSchema, TraitSchema } from "./basic-types-schema";
import exp from "constants";

export const PlanetAttachmentSchema = z
  .object({
    name: z.string(),
    nsidName: NsidNameSchema, // NSID "token.attachment.planet:${source}/${nsidName}"

    imgFaceDown: z.boolean().optional(),
    imgPackageId: z.string().optional(),

    influence: z.number().optional(),
    influenceFaceDown: z.number().optional(),
    resources: z.number().optional(),
    resourcesFaceDown: z.number().optional(),
    techs: z.array(TechSchema).optional(),
    techsFaceDown: z.array(TechSchema).optional(),
    traits: z.array(TraitSchema).optional(),
    traitsFaceDown: z.array(TraitSchema).optional(),
    isLegendary: z.boolean().optional(),
    legendaryNsidName: z.string().optional(),
    isDestroyPlanet: z.boolean().optional(),
  })
  .strict()
  .readonly();

export type PlanetAttachmentSchemaType = z.infer<typeof PlanetAttachmentSchema>;
