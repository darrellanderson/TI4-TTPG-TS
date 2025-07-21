"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlowingToken = void 0;
const api_1 = require("@tabletop-playground/api");
/**
 * Add a glowing effect to a token.
 * Emission mask is fixed in the template, but we can add glowing lines.
 */
class GlowingToken {
    constructor(token) {
        this._lineWidth = 0.2;
        this._color = new api_1.Color(1, 0, 0, 1);
        this._obj = token;
        for (const line of token.getDrawingLines()) {
            token.removeDrawingLineObject(line);
        }
        token.addDrawingLine(this._getDrawingLine());
    }
    _getPoints() {
        const currentRotation = false;
        const includeGeometry = false;
        const extent = this._obj.getExtent(currentRotation, includeGeometry);
        const center = new api_1.Vector(0, 0, 0); // local
        const localZ = extent.z + 0.01;
        const r = Math.min(extent.x, extent.y) - this._lineWidth / 2;
        const points = [];
        const numPoints = 32;
        const deltaPhi = (Math.PI * 2) / numPoints;
        for (let phi = 0; phi <= Math.PI * 2 + 0.01; phi += deltaPhi) {
            const p = new api_1.Vector(Math.cos(phi) * r, Math.sin(phi) * r, localZ);
            points.push(p.add(center));
        }
        return points;
    }
    /**
     * Get a DrawingLine with points in local object space.
     *
     * @returns
     */
    _getDrawingLine() {
        const points = this._getPoints();
        const line = new api_1.DrawingLine();
        line.color = this._color;
        line.emissiveStrength = 64; // 0-64
        line.normals = [new api_1.Vector(0, 0, 1)];
        line.points = points;
        line.rounded = false;
        line.thickness = this._lineWidth;
        return line;
    }
}
exports.GlowingToken = GlowingToken;
//# sourceMappingURL=glowing-token.js.map