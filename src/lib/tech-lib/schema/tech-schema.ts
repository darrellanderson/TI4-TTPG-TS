import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { z } from "zod";

export const TechColorSchema = z.enum([
  "blue",
  "green",
  "red",
  "yellow",
  "unit-upgrade",
]);
export type TechColorType = z.infer<typeof TechColorSchema>;

export const TechSchema = z
  .object({
    nsidName: NsidNameSchema,
    name: z.string().min(1),
    color: TechColorSchema,
    prerequisites: z.array(
      z
        .object({ color: TechColorSchema, count: z.number().int().min(0) })
        .strict()
        .readonly()
    ),
    isFactionTech: z.boolean().optional(),
  })
  .strict()
  .readonly();
export type TechSchemaType = z.infer<typeof TechSchema>;
