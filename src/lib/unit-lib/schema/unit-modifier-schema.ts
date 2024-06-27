import { z } from "zod";

export const UnitModifierSchema = z.object({
  name: z.string(),
  description: z.string(),

  nsidNames: z.array(z.string()).optional(),

  isActiveIdle: z.boolean().optional(),
  isCombat: z.boolean().optional(),
  owner: z.enum(["self", "opponent", "any"]),
  priority: z.enum(["mutate", "mutate.late", "adjust", "choose"]),
});
export type UnitModifierSchemaType = z.infer<typeof UnitModifierSchema>;
