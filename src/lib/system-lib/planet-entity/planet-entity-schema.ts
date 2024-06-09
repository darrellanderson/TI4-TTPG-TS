import { z } from "zod";

export const PlanetEntitySchema = z
  .object({
    // Human readable name.
    name: z.string(),

    // Attachment token.
    nsid: z.string().optional(),

    // Local position within the system tile.
    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .strict()
      .optional(),
    radius: z.number().optional(),

    influence: z.number().optional(),
    resources: z.number().optional(),
    techs: z.array(z.enum(["blue", "green", "red", "yellow"])).optional(),
    traits: z.array(z.enum(["cultural", "hazardous", "industrial"])).optional(),
    isLegendary: z.boolean().optional(),
    isDestroyPlanet: z.boolean().optional(),

    // Attachment token image, PNG transparent square, fill to edges.
    img: z.string().optional(),
    imgPackageId: z.string().optional(),
  })
  .strict();

export type PlanetEntityType = z.infer<typeof PlanetEntitySchema>;
