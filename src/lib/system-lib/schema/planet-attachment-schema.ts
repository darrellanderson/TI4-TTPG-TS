import { z } from "zod";
import { TechSchema, TraitSchema } from "./basic-types-schema";

export const PlanetAttachmentSchema = z.object({
  name: z.string(),
  nsid: z.string(),

  img: z.string().optional(),
  imgPackageId: z.string().optional(),

  influence: z.number().optional(),
  resources: z.number().optional(),
  techs: z.array(TechSchema).optional(),
  traits: z.array(TraitSchema).optional(),
  isLegendary: z.boolean().optional(),
  legendaryCardNsid: z.string().optional(),
  isDestroyPlanet: z.boolean().optional(),
});
