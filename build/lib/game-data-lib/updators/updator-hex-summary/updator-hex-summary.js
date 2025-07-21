"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorHexSummary = void 0;
const api_1 = require("@tabletop-playground/api");
const unit_plastic_1 = require("../../../unit-lib/unit-plastic/unit-plastic");
const hex_summary_codes_1 = require("./hex-summary-codes");
const sort_entity_type_1 = require("./sort-entity-type");
// Top: system1,system2,...
// System: <tile><X><Y>space;planet1;planet2;...
// Region: <color[A-Z]><count[0-9]*><unit[a-z]>*<attachments>
// Within a system color is sticky (seed empty for tokens)
// Within a region count is sticky (seed 1), reset to 1 for attachments
const DELIMITER = {
    SYSTEM: ",",
    PLANET: ";",
    ATTACHMENTS: "*",
};
// Encode units in hexes
class UpdatorHexSummary {
    update(gameData) {
        gameData.hexSummary = "foo";
    }
    _getAllEntityTypes() {
        const entityTypes = [];
        const codes = new hex_summary_codes_1.HexSummaryCodes();
        const plastics = unit_plastic_1.UnitPlastic.getAll();
        unit_plastic_1.UnitPlastic.assignOwners(plastics);
        for (const plastic of plastics) {
            const entity = codes.unitEntity(plastic);
            if (entity) {
                entityTypes.push(entity);
            }
        }
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            let entity;
            entity = codes.tokenEntity(obj);
            if (entity) {
                entityTypes.push(entity);
            }
            entity = codes.attachmentEntity(obj);
            if (entity) {
                entityTypes.push(entity);
            }
        }
        return entityTypes;
    }
    _mergeEntityTypes(entityTypes) {
        const merged = [];
        for (const entityType of entityTypes) {
            // Start with the first.
            if (merged.length === 0) {
                merged.push(entityType);
                continue;
            }
            // If the previous is the same, merge.
            const prev = merged[merged.length - 1];
            if (prev &&
                prev.code === entityType.code &&
                prev.colorCode === entityType.colorCode &&
                prev.planetIndex === entityType.planetIndex) {
                prev.count = prev.count + entityType.count;
                continue;
            }
            // Otherwise, add a new one.
            merged.push(entityType);
        }
        return merged;
    }
    /**
     * Seconds: hex position.
     * @param hex
     * @returns
     */
    _encodeHex(hex) {
        const halfSize = 5.77735 * 1.5;
        const pos = TI4.hex.toPosition(hex);
        const scaleW = (halfSize * Math.sqrt(3)) / 2;
        const scaleH = halfSize * Math.sqrt(3);
        const y = Math.round(pos.x / scaleW);
        const x = Math.round(pos.y / scaleH);
        return `${x >= 0 ? "+" : ""}${x}${y >= 0 ? "+" : ""}${y}`;
    }
    /**
     * Third: what is in the system.
     * @param entityTypes
     * @returns
     */
    _encodeEntityTypes(entityTypes) {
        new sort_entity_type_1.SortEntityType().sort(entityTypes);
        entityTypes = this._mergeEntityTypes(entityTypes);
        const result = [];
        let stickyPlanetIndex = -1;
        let stickyColor = "";
        let stickyCount = 1;
        let stickyAttachment = false;
        for (const entry of entityTypes) {
            // Planet change?  (Keep color)
            if (entry.planetIndex !== stickyPlanetIndex) {
                result.push(DELIMITER.PLANET);
                stickyPlanetIndex = entry.planetIndex;
                stickyCount = 1;
                stickyAttachment = false;
            }
            // Attachment change?
            const attachment = entry.attachment ? true : false;
            if (attachment !== stickyAttachment) {
                // Should only ever toggle to true.
                result.push(DELIMITER.ATTACHMENTS);
                stickyColor = "";
                stickyCount = 1;
                stickyAttachment = attachment;
            }
            // Color change?
            const color = entry.colorCode !== undefined ? entry.colorCode : "";
            if (color !== stickyColor) {
                result.push(color);
                stickyColor = color;
                stickyCount = 1;
            }
            // Count change?
            if (entry.count !== stickyCount) {
                result.push(entry.count.toString());
                stickyCount = entry.count;
            }
            if (entry.code) {
                result.push(entry.code);
            }
        }
        return result.join("");
    }
    encodeAll() {
        const parts = [];
        const codes = new hex_summary_codes_1.HexSummaryCodes();
        const hexToSystem = codes.getHexToSystem();
        const allEntityTypes = this._getAllEntityTypes();
        for (const [hex, system] of hexToSystem.entries()) {
            if (parts.length > 0) {
                parts.push(DELIMITER.SYSTEM);
            }
            const tile = system.getSystemTileNumber();
            parts.push(tile.toString());
            parts.push(this._encodeHex(hex));
            const entityTypes = allEntityTypes.filter((entityType) => {
                return entityType.hex === hex;
            });
            parts.push(this._encodeEntityTypes(entityTypes));
        }
        return parts.join("");
    }
}
exports.UpdatorHexSummary = UpdatorHexSummary;
//# sourceMappingURL=updator-hex-summary.js.map