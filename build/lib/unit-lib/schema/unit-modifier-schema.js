"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitModifierSchema = exports.UnitModifierPriority = exports.UnitModifierOwner = exports.UnitModifierTrigger = exports.UnitModifierCardClass = void 0;
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
const zod_1 = require("zod");
exports.UnitModifierCardClass = zod_1.z
    .enum([
    "action",
    "agenda",
    "agent",
    "alliance",
    "commander",
    "faction-ability", // not a card
    "hero",
    "legendary",
    "mech",
    "promissory",
    "relic",
    "technology.blue",
    "technology.green",
    "technology.red",
    "technology.yellow",
    "technology.unit-upgrade",
    "unit", // not a card
])
    .readonly();
exports.UnitModifierTrigger = zod_1.z
    .object({
    cardClass: exports.UnitModifierCardClass,
    nsidName: basic_types_schema_1.NsidNameSchema,
    overrideSource: basic_types_schema_1.NsidNameSchema.optional(),
})
    .strict()
    .readonly();
exports.UnitModifierOwner = zod_1.z.enum(["self", "opponent", "any"]).readonly();
exports.UnitModifierPriority = zod_1.z
    .enum(["mutate", "mutate-late", "adjust", "choose"])
    .readonly();
exports.UnitModifierSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    triggerAlways: zod_1.z.boolean().optional(),
    triggers: zod_1.z.array(exports.UnitModifierTrigger),
    isActiveIdle: zod_1.z.boolean().optional(),
    owner: exports.UnitModifierOwner,
    priority: exports.UnitModifierPriority,
    // Should this modifier be used?
    // Zod supports z.* argument validation, use z.any() to allow something else.
    // Argument is CombatRoll (see lib/combat-lib/combat-roll/combat-roll.ts).
    applies: zod_1.z.function().args(zod_1.z.any()).returns(zod_1.z.boolean()),
    // Apply the modifier to the unit attributes.
    // Zod supports z.* argument validation, use z.any() to allow something else.
    // Argument is CombatRoll (see lib/combat-lib/combat-roll/combat-roll.ts).
    apply: zod_1.z.function().args(zod_1.z.any()).returns(zod_1.z.void()),
})
    .strict()
    .readonly();
//# sourceMappingURL=unit-modifier-schema.js.map