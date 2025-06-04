import { z } from "zod";
import {
  NsidNameSchema,
  PlanetTechSchema,
  TraitSchema,
} from "./basic-types-schema";

export const PlanetAttachmentSchema = z
  .object({
    name: z.string(),
    nsidName: NsidNameSchema, // NSID "token.attachment.planet:${source}/${nsidName}"
    imgFaceDown: z.boolean().optional(), // has separate back image?
    doNotAttach: z.boolean().optional(), // do not attach, or add to registry

    influence: z.number().optional(),
    influenceFaceDown: z.number().optional(),
    resources: z.number().optional(),
    resourcesFaceDown: z.number().optional(),
    techs: z.array(PlanetTechSchema).optional(),
    techsFaceDown: z.array(PlanetTechSchema).optional(),
    traits: z.array(TraitSchema).optional(),
    traitsFaceDown: z.array(TraitSchema).optional(),
    isLegendary: z.boolean().optional(),
    legendaryNsidName: z.string().optional(),
    isDestroyPlanet: z.boolean().optional(),

    flipIfNoPlanetTech: z.boolean().optional(),
  })
  .strict()
  .readonly();

export type PlanetAttachmentSchemaType = z.infer<typeof PlanetAttachmentSchema>;
