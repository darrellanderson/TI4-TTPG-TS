import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { z } from "zod";

export const UnitModifierSchema = z.object({
  name: z.string(),
  description: z.string(),

  nsidNames: z.array(NsidNameSchema).optional(),

  isActiveIdle: z.boolean().optional(),
  isCombat: z.boolean().optional(),
  owner: z.enum(["self", "opponent", "any"]),
  priority: z.enum(["mutate", "adjust", "choose"]),

  applies: z.function().args(z.any()).returns(z.boolean()).optional(),
  apply: z.function().args(z.any()).returns(z.void()).optional(),
});
export type UnitModifierSchemaType = z.infer<typeof UnitModifierSchema>;
