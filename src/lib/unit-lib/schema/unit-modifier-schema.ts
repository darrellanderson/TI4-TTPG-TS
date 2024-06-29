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

  // Should this modifier be used?
  // Zod supports z.* argument validation, use z.any() to allow something else.
  applies: z.function().args(z.any()).returns(z.boolean()).optional(),

  // Apply the modifier to the unit attributes.
  // Zod supports z.* argument validation, use z.any() to allow something else.
  apply: z.function().args(z.any()).returns(z.void()).optional(),
});
export type UnitModifierSchemaType = z.infer<typeof UnitModifierSchema>;
