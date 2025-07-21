"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAttachmentSchema = void 0;
const zod_1 = require("zod");
const basic_types_schema_1 = require("./basic-types-schema");
const planet_schema_1 = require("./planet-schema");
exports.SystemAttachmentSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    nsidName: basic_types_schema_1.NsidNameSchema, // NSID "token.attachment.system:${source}/${nsidName}"
    imgFaceDown: zod_1.z.boolean().optional(), // has separate back image?
    doNotAttach: zod_1.z.boolean().optional(), // do not attach, or add to registry
    anomalies: zod_1.z.array(basic_types_schema_1.AnomalySchema).optional(),
    wormholes: zod_1.z.array(basic_types_schema_1.WormholeSchema).optional(),
    wormholesFaceDown: zod_1.z.array(basic_types_schema_1.WormholeSchema).optional(),
    isDestroyWormhole: zod_1.z.boolean().optional(),
    planets: zod_1.z.array(planet_schema_1.PlanetSchema).optional(),
})
    .strict()
    .readonly();
//# sourceMappingURL=system-attachment-schema.js.map