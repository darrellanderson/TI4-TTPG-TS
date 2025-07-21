"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitAttrsSchema = exports.CombatAttrsSchema = exports.UnitSchema = void 0;
const zod_1 = require("zod");
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
exports.UnitSchema = zod_1.z
    .enum([
    "carrier",
    "control-token", // not a unit per-se, but useful to track for control
    "cruiser",
    "destroyer",
    "dreadnought",
    "fighter",
    "flagship",
    "infantry",
    "mech",
    "pds",
    "space-dock",
    "war-sun",
])
    .readonly();
exports.CombatAttrsSchema = zod_1.z
    .object({
    dice: zod_1.z.number().optional(), // N dice per object
    hit: zod_1.z.number(), // hit in N or better
    extraDice: zod_1.z.number().optional(), // N extra dice overall (not per object)
    rerollMisses: zod_1.z.boolean().optional(),
    crit: zod_1.z.number().optional(), // crit on N or better, e.g. jol-nar flagship
    critCount: zod_1.z.number().optional(), // N extra hits on crit
    range: zod_1.z.number().optional(), // range in hexes: 0=local, 1=adjacent
})
    .strict()
    .readonly();
exports.UnitAttrsSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1), // e.g. "Carrier II"
    unit: exports.UnitSchema, // base unit type, unit upgrades overrride
    componentCount: zod_1.z.number().optional(), // component count, e.g. fighters = 10
    diceColor: zod_1.z
        .string()
        .regex(/#[0-9a-fA-F]{6}/)
        .optional(), // e.g. "#ff0000"
    // Faction attr or tech ("card.technology.unit:{source}/{nsidName}").
    // Missing: base unit, "x": faction base unit, "x-2": unit upgrade.
    nsidName: basic_types_schema_1.NsidNameSchema.optional(),
    cost: zod_1.z.number().optional(),
    producePerCost: zod_1.z.number().optional(), // e.g. 2 for fighters
    isShip: zod_1.z.boolean().optional(),
    isGround: zod_1.z.boolean().optional(),
    hasSustainDamage: zod_1.z.boolean().optional(),
    hasPlanetaryShield: zod_1.z.boolean().optional(),
    disablePlanetaryShield: zod_1.z.boolean().optional(),
    antiFighterBarrage: exports.CombatAttrsSchema.optional(),
    bombardment: exports.CombatAttrsSchema.optional(),
    spaceCannon: exports.CombatAttrsSchema.optional(),
    spaceCombat: exports.CombatAttrsSchema.optional(),
    groundCombat: exports.CombatAttrsSchema.optional(),
    // Destroyer Strike Wing Alpha 2's AFB can destroy infantry in space.
    afbDestroyInfantryInSpace: zod_1.z.number().optional(),
})
    .strict()
    .readonly();
//# sourceMappingURL=unit-attrs-schema.js.map