import { z } from "zod";

export const SystemEntitySchema = z
  .object({
    name: z.string(),

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

export type SystemEntityType = z.infer<typeof SystemEntitySchema>;
