import { z } from "zod";

export const SystemEntitySchema = z
  .object({
    name: z.string(),

    anomalies: z.array(z.string()).optional(),
    nsid: z.string().optional(),
    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .strict()
      .optional(),
    wormholes: z.array(z.string()).optional(),
  })
  .strict();

export type SystemEntityType = z.infer<typeof SystemEntitySchema>;
