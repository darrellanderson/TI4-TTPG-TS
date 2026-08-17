import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { z } from "zod";

export const FactionTechSchema = z
    .object({
        nsidName: NsidNameSchema,
        name: z.string().min(1),
        abbr: z.string().min(1).optional(), // shorter name
        customModel: z.boolean().optional(), // do not auto-generate card with ti4-hb-helper
    })
    .strict()
    .readonly();
export type FactionTechSchemaType = z.infer<typeof FactionTechSchema>;