import { z } from "zod";

export const SystemEntySchema = z
  .object({
    name: z.string(),
    type: z.enum([
      "anomaly",
      "homebrew",
      "planet",
      "planet-attachment",
      "wormhole",
    ]),

    nsid: z.string().optional(),
    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type SystemEntityType = z.infer<typeof SystemEntySchema>;
