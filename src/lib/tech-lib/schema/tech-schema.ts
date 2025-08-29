import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { z } from "zod";

export const TechColorSchema = z.enum([
  "blue",
  "green",
  "red",
  "yellow",
  "unit-upgrade",
  "none", // valefar assimilator (nekro faction tech)
]);
export type TechColorType = z.infer<typeof TechColorSchema>;

export const TechSchema = z
  .object({
    nsidName: NsidNameSchema,
    name: z.string().min(1),
    abbr: z.string().min(1).optional(), // shorter name
    color: TechColorSchema,
    prerequisites: z
      .object({
        blue: z.number().int().min(0).optional(),
        green: z.number().int().min(0).optional(),
        red: z.number().int().min(0).optional(),
        yellow: z.number().int().min(0).optional(),
      })
      .strict(),
    isFactionTech: z.boolean().optional(),
    replacesNsidName: z.string().min(1).optional(), // faction unit upgrade override this base unit upgrade, e.g. "carrier-2"

    customModel: z.boolean().optional(), // do not auto-generate card with ti4-hb-helper
  })
  .strict()
  .readonly();
export type TechSchemaType = z.infer<typeof TechSchema>;
