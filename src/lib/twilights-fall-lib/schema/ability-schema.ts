import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { z } from "zod";

export const AbilityColorSchema = z.enum([
    "blue",
    "green",
    "red",
    "yellow",
]);
export type AbilityColorType = z.infer<typeof AbilityColorSchema>;

export const AbilitySchema = z
    .object({
        nsidName: NsidNameSchema,
        name: z.string().min(1),
        abbr: z.string().min(1).optional(), // shorter name
        color: AbilityColorSchema,
        origin: z.string().min(1),
        customModel: z.boolean().optional(), // do not auto-generate card with ti4-hb-helper
    })
    .strict()
    .readonly();
export type AbilitySchemaType = z.infer<typeof AbilitySchema>;