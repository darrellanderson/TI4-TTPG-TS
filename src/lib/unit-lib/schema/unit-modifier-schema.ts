import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { z } from "zod";

export const UnitModifierCardClass = z
  .enum([
    "action",
    "agenda",
    "agent",
    "alliance",
    "commander",
    "faction-ability", // not a card
    "flagship", // not a card
    "hero",
    "legendary",
    "mech",
    "promissory",
    "relic",
    "technology.blue",
    "technology.green",
    "technology.red",
    "technology.unit-upgrade",
  ])
  .readonly();
export type UnitModifierCardClassType = z.infer<typeof UnitModifierCardClass>;

export const UnitModifierTrigger = z
  .object({
    cardClass: UnitModifierCardClass,
    nsidName: NsidNameSchema,
    overrideSource: NsidNameSchema.optional(),
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
    description: z.string(),

    triggerAlways: z.boolean().optional(),
    triggers: z.array(UnitModifierTrigger),

    isActiveIdle: z.boolean().optional(),
    owner: UnitModifierOwner,
    priority: UnitModifierPriority,

    // Should this modifier be used?
    // Zod supports z.* argument validation, use z.any() to allow something else.
    // Argument is CombatRoll (see lib/combat-lib/combat-roll/combat-roll.ts).
    applies: z.function().args(z.any()).returns(z.boolean()),

    // Apply the modifier to the unit attributes.
    // Zod supports z.* argument validation, use z.any() to allow something else.
    // Argument is CombatRoll (see lib/combat-lib/combat-roll/combat-roll.ts).
    apply: z.function().args(z.any()).returns(z.void()),
  })
  .strict()
  .readonly();
export type UnitModifierSchemaType = Omit<
  z.infer<typeof UnitModifierSchema>,
  "apply" | "applies"
> & {
  applies: (combatRoll: CombatRoll) => boolean;
  apply: (combatRoll: CombatRoll) => void;
};
