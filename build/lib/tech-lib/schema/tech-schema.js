"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechSchema = exports.TechColorSchema = void 0;
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
const zod_1 = require("zod");
exports.TechColorSchema = zod_1.z.enum([
    "blue",
    "green",
    "red",
    "yellow",
    "unit-upgrade",
    "none", // valefar assimilator (nekro faction tech)
]);
exports.TechSchema = zod_1.z
    .object({
    nsidName: basic_types_schema_1.NsidNameSchema,
    name: zod_1.z.string().min(1),
    abbr: zod_1.z.string().min(1).optional(), // shorter name
    color: exports.TechColorSchema,
    prerequisites: zod_1.z
        .object({
        blue: zod_1.z.number().int().min(0).optional(),
        green: zod_1.z.number().int().min(0).optional(),
        red: zod_1.z.number().int().min(0).optional(),
        yellow: zod_1.z.number().int().min(0).optional(),
    })
        .strict(),
    isFactionTech: zod_1.z.boolean().optional(),
    replacesNsidName: zod_1.z.string().min(1).optional(), // faction unit upgrade override this base unit upgrade, e.g. "carrier-2"
})
    .strict()
    .readonly();
//# sourceMappingURL=tech-schema.js.map