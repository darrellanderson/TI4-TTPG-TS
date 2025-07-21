"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetAttachmentSchema = void 0;
const zod_1 = require("zod");
const basic_types_schema_1 = require("./basic-types-schema");
exports.PlanetAttachmentSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    nsidName: basic_types_schema_1.NsidNameSchema, // NSID "token.attachment.planet:${source}/${nsidName}"
    imgFaceDown: zod_1.z.boolean().optional(), // has separate back image?
    doNotAttach: zod_1.z.boolean().optional(), // do not attach, or add to registry
    influence: zod_1.z.number().optional(),
    influenceFaceDown: zod_1.z.number().optional(),
    resources: zod_1.z.number().optional(),
    resourcesFaceDown: zod_1.z.number().optional(),
    techs: zod_1.z.array(basic_types_schema_1.PlanetTechSchema).optional(),
    techsFaceDown: zod_1.z.array(basic_types_schema_1.PlanetTechSchema).optional(),
    traits: zod_1.z.array(basic_types_schema_1.TraitSchema).optional(),
    traitsFaceDown: zod_1.z.array(basic_types_schema_1.TraitSchema).optional(),
    isLegendary: zod_1.z.boolean().optional(),
    legendaryNsidName: zod_1.z.string().optional(),
    isDestroyPlanet: zod_1.z.boolean().optional(),
    flipIfNoPlanetTech: zod_1.z.boolean().optional(),
})
    .strict()
    .readonly();
//# sourceMappingURL=planet-attachment-schema.js.map