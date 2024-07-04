import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { z } from "zod";

export const UnitModifierCardClass = z
  .enum([
    "action",
    "agenda",
    "agent",
    "alliance",
    "commander",
    "faction-ability",
    "hero",
    "legendary",
    "promissory",
    "relic",
    "technology",
  ])
  .readonly();
export type UnitModifierCardClassType = z.infer<typeof UnitModifierCardClass>;

export const UnitModifierTrigger = z
  .object({
    cardClass: UnitModifierCardClass.optional(),
    nsidName: NsidNameSchema,
  })
  .strict()
  .readonly();
export type UnitModifierTriggerType = z.infer<typeof UnitModifierTrigger>;

export const UnitModifierOwner = z.enum(["self", "opponent", "any"]).readonly();
export type UnitModifierOwnerType = z.infer<typeof UnitModifierOwner>;

export const UnitModifierPriority = z
  .enum(["mutate", "mutate-late", "adjust", "choose"])
  .readonly();
export type UnitModifierPriorityType = z.infer<typeof UnitModifierPriority>;

export const UnitModifierSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),

    triggers: z.array(UnitModifierTrigger).optional(),

    isActiveIdle: z.boolean().optional(),
    isCombat: z.boolean().optional(),
    owner: UnitModifierOwner,
    priority: UnitModifierPriority,

    // Should this modifier be used?
    // Zod supports z.* argument validation, use z.any() to allow something else.
    applies: z.function().args(z.any()).returns(z.boolean()).optional(),

    // Apply the modifier to the unit attributes.
    // Zod supports z.* argument validation, use z.any() to allow something else.
    apply: z.function().args(z.any()).returns(z.void()).optional(),
  })
  .strict()
  .readonly();
export type UnitModifierSchemaType = z.infer<typeof UnitModifierSchema>;
