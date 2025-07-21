"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSchema = void 0;
const zod_1 = require("zod");
const basic_types_schema_1 = require("./basic-types-schema");
const planet_schema_1 = require("./planet-schema");
exports.SystemSchema = zod_1.z
    .object({
    tile: zod_1.z.number(), // NSID "tile.system:${source}/${tile}"
    // "map" items are adjacent to other "map" items.
    // "offMap" items are never adjacent to any others (except by wormholes).
    class: basic_types_schema_1.SystemClassSchema.optional(),
    // "map" class but not eligible for drafting, e.g. Muaat hero system.
    isExcludeFromDraft: zod_1.z.boolean().optional(),
    isHome: zod_1.z.boolean().optional(),
    isHyperlane: zod_1.z.boolean().optional(),
    anomalies: zod_1.z.array(basic_types_schema_1.AnomalySchema).optional(),
    wormholes: zod_1.z.array(basic_types_schema_1.WormholeSchema).optional(),
    wormholesFaceDown: zod_1.z.array(basic_types_schema_1.WormholeSchema).optional(),
    // Some systems have wormholes in non-standard positions.
    // Wormhole nexus changes wormholes when flipped.
    wormholesWithPositions: zod_1.z.array(basic_types_schema_1.WormholeWithPositionSchema).optional(),
    wormholesWithPositionsFaceDown: zod_1.z
        .array(basic_types_schema_1.WormholeWithPositionSchema)
        .optional(),
    hyperlanes: basic_types_schema_1.HyperlaneSchema.optional(),
    hyperlanesFaceDown: basic_types_schema_1.HyperlaneSchema.optional(),
    planets: zod_1.z.array(planet_schema_1.PlanetSchema).optional(),
    // System tile image, PNG transparent square, fill to left/right edge.
    imgFaceDown: zod_1.z.boolean().optional(), // has a custom back image
})
    .strict()
    .readonly();
//# sourceMappingURL=system-schema.js.map