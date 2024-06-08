import { z } from "zod";

export const SYSTEM_ENTITY_SCHEMA = z
  .object({
    name: z.string(),
    nsid: z.string().optional(),
    type: z.enum([
      "anomaly",
      "homebrew",
      "planet",
      "planet-attachment",
      "wormhole",
    ]),

    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type SystemEntityType = z.infer<typeof SYSTEM_ENTITY_SCHEMA>;
