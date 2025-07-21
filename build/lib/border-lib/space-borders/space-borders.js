"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceBorders = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Get DrawingLines demarcating space borders.
 */
class SpaceBorders {
    constructor(hexToControlSystemEntry, lineThickness) {
        this._hexToControlSystemEntry = hexToControlSystemEntry;
        this._lineThickness = lineThickness;
    }
    _getLineSegments(owner) {
        // line a->b is clockwise winding for inset logic.
        const result = [];
        for (const [hex, controlSystemEntry] of this._hexToControlSystemEntry) {
            if (controlSystemEntry.spaceOwningPlayerSlot !== owner) {
                continue; // no or different ownership
            }
            const corners = TI4.hex.corners(hex); // top right, then counterclockwise
            const neighbors = ttpg_darrell_1.Hex.neighbors(hex); // top, then counterclockwise
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                if (neighbor) {
                    // Add a border line if neighbor is not owned by the same player.
                    const neighborSummary = this._hexToControlSystemEntry.get(neighbor);
                    if (!neighborSummary ||
                        neighborSummary.spaceOwningPlayerSlot !== owner) {
                        const a = corners[i];
                        const b = corners[(i + 1) % corners.length];
                        if (a && b) {
                            result.push({ a, b });
                        }
                    }
                }
            }
        }
        return result;
    }
    _getPolygons(owner) {
        // Connect line segments into polygons.  The nature of borders should
        // generate fully connected "rings", but that is not required here.
        const lineSegments = this._getLineSegments(owner);
        return ttpg_darrell_1.Polygon.conjoin(lineSegments);
    }
    _getDrawingLinesByOwner(owner) {
        const lines = [];
        const color = TI4.playerColor.getSlotWidgetColor(owner);
        if (!color) {
            return lines;
        }
        const polygons = this._getPolygons(owner);
        const z = api_1.world.getTableHeight() + 0.3;
        for (let polygon of polygons) {
            polygon = polygon.inset(this._lineThickness / 2);
            const line = new api_1.DrawingLine();
            line.color = color;
            line.normals = [new api_1.Vector(0, 0, 1)];
            line.points = polygon.getPoints().map((v) => {
                v.z = z;
                return v;
            });
            line.rounded = false;
            line.thickness = this._lineThickness;
            lines.push(line);
        }
        return lines;
    }
    getDrawingLines() {
        const lines = [];
        for (const seat of TI4.playerSeats.getAllSeats()) {
            const owner = seat.playerSlot;
            const ownerLines = this._getDrawingLinesByOwner(owner);
            lines.push(...ownerLines);
        }
        return lines;
    }
}
exports.SpaceBorders = SpaceBorders;
//# sourceMappingURL=space-borders.js.map