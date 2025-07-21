"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactionSchema = void 0;
const zod_1 = require("zod");
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
exports.FactionSchema = zod_1.z
    .object({
    nsidName: basic_types_schema_1.NsidNameSchema,
    name: zod_1.z.string().min(1), // human-readable name
    abbr: zod_1.z.string().min(1), // abbreviation
    abilities: zod_1.z.array(basic_types_schema_1.NsidNameSchema),
    commodities: zod_1.z.number().int().min(0),
    factionTechs: zod_1.z.array(basic_types_schema_1.NsidNameSchema).min(2), // omega versions listed separately, can have more than 2
    home: zod_1.z.number().int().min(0),
    homeSurrogate: zod_1.z.number().int().min(0).optional(), // home is off-map, place this tile in home pos
    leaders: zod_1.z
        .object({
        agents: zod_1.z.array(basic_types_schema_1.NsidNameSchema),
        commanders: zod_1.z.array(basic_types_schema_1.NsidNameSchema),
        heroes: zod_1.z.array(basic_types_schema_1.NsidNameSchema),
        mechs: zod_1.z.array(basic_types_schema_1.NsidNameSchema),
    })
        .strict()
        .readonly(),
    promissories: zod_1.z.array(basic_types_schema_1.NsidNameSchema),
    startingTechs: zod_1.z.array(basic_types_schema_1.NsidNameSchema),
    startingUnits: zod_1.z
        .object({
        carrier: zod_1.z.number().int().min(0).optional(),
        cruiser: zod_1.z.number().int().min(0).optional(),
        destroyer: zod_1.z.number().int().min(0).optional(),
        dreadnought: zod_1.z.number().int().min(0).optional(),
        fighter: zod_1.z.number().int().min(0).optional(),
        flagship: zod_1.z.number().int().min(0).optional(),
        infantry: zod_1.z.number().int().min(0).optional(),
        mech: zod_1.z.number().int().min(0).optional(),
        pds: zod_1.z.number().int().min(0).optional(),
        spaceDock: zod_1.z.number().int().min(0).optional(),
        warSun: zod_1.z.number().int().min(0).optional(),
    })
        .strict()
        .readonly(),
    unitOverrides: zod_1.z.array(basic_types_schema_1.NsidNameSchema), // automatic units (flagship, etc), NOT mech or upgrades (those have cards)
    extras: zod_1.z
        .array(zod_1.z
        .object({
        nsid: zod_1.z.string(),
        count: zod_1.z.number().int().min(0).optional(),
    })
        .strict()
        .readonly())
        .optional(),
})
    .strict()
    .readonly();
//# sourceMappingURL=faction-schema.js.map