"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutMapArea = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
// Draw map rings.
const HEX_CORNERS = [
    { q: 1, r: 0, s: -1 },
    { q: 0, r: 1, s: -1 },
    { q: -1, r: 1, s: 0 },
    { q: -1, r: 0, s: 1 },
    { q: 0, r: -1, s: 1 },
    { q: 1, r: -1, s: 0 },
];
const THICKNESS = 1;
const COLORS = [
    "#008080", // teal
    "#FC6A03", // orange
    "#F46FCD", // pink
    "#00CFFF", // blue
    "#F0F0F0", // white
];
class LayoutMapArea {
    constructor(numRings) {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        // Reserve size.
        let x = 0;
        let y = 0;
        for (const corner of this._getCorners(1, false)) {
            x = Math.max(x, corner.x);
            y = Math.max(y, corner.y);
        }
        this._layout
            .setOverrideWidth(y * 2 * numRings + 24)
            .setOverrideHeight(x * 2 * numRings + 1);
        this._layout.addAfterLayout(() => {
            this._addMapRingLines(numRings);
        });
    }
    getLayout() {
        return this._layout;
    }
    _getCorners(ring, overrun) {
        const z = api_1.world.getTableHeight() + 0.02;
        const points = HEX_CORNERS.map((corner) => {
            const q = corner.q * ring;
            const r = corner.r * ring;
            const s = corner.s * ring;
            const hex = `<${q},${r},${s}>`;
            const pos = TI4.hex.toPosition(hex);
            pos.z = z;
            return pos;
        });
        const first = points[0];
        const second = points[1];
        if (overrun && first && second) {
            points.push(first.clone());
            points.push(second.clone());
        }
        return points;
    }
    _addMapRingLines(numRings) {
        const tag = "map-ring";
        for (const line of api_1.world.getDrawingLines()) {
            if (line.tag === tag) {
                api_1.world.removeDrawingLineObject(line);
            }
        }
        for (let i = 1; i <= numRings; i++) {
            const colorHex = COLORS[i % COLORS.length];
            const points = this._getCorners(i, true);
            if (colorHex) {
                // Darken color.
                const color = new ttpg_darrell_1.ColorLib().parseColorOrThrow(colorHex);
                const s = 0.25;
                color.r *= s;
                color.g *= s;
                color.b *= s;
                const line = new api_1.DrawingLine();
                line.color = color;
                line.normals = [new api_1.Vector(0, 0, 1)];
                line.points = points;
                line.rounded = false;
                line.tag = tag;
                line.thickness = THICKNESS;
                api_1.world.addDrawingLine(line);
            }
        }
    }
}
exports.LayoutMapArea = LayoutMapArea;
//# sourceMappingURL=layout-map-area.js.map