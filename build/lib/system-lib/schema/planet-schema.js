"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetSchema = void 0;
const zod_1 = require("zod");
const basic_types_schema_1 = require("./basic-types-schema");
exports.PlanetSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1),
    nsidName: basic_types_schema_1.NsidNameSchema, // card NSID "card.planet:${source}/${nsidName}"
    localPosition: basic_types_schema_1.LocalPositionSchema.optional(),
    localPositionFaceDown: basic_types_schema_1.LocalPositionSchema.optional(),
    radius: zod_1.z.number().optional(),
    influence: zod_1.z.number().optional(),
    resources: zod_1.z.number().optional(),
    techs: zod_1.z.array(basic_types_schema_1.PlanetTechSchema).optional(),
    traits: zod_1.z.array(basic_types_schema_1.TraitSchema).optional(),
    isLegendary: zod_1.z.boolean().optional(),
    legendaryNsidName: basic_types_schema_1.NsidNameSchema.optional(), // card NSID "card.legendary-planet:${source}/${legendaryNsidName}"
})
    .strict()
    .readonly();
//# sourceMappingURL=planet-schema.js.map