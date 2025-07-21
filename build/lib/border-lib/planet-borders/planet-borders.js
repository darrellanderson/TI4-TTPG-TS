"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetBorders = void 0;
const api_1 = require("@tabletop-playground/api");
class PlanetBorders {
    constructor(hexToControlSystemEntry, lineThickness) {
        this._hexToControlSystemEntry = hexToControlSystemEntry;
        this._lineThickness = lineThickness;
    }
    _getPlanetDrawingLine(planet, owner) {
        const color = TI4.playerColor.getSlotWidgetColor(owner);
        if (!color) {
            return undefined; // also handles -1, -2 owners
        }
        const z = api_1.world.getTableHeight() + 0.3;
        const points = planet.getPositionAsCircle();
        const line = new api_1.DrawingLine();
        line.color = color;
        line.normals = [new api_1.Vector(0, 0, 1)];
        line.points = points.map((v) => {
            v.z = z;
            return v;
        });
        line.rounded = false;
        line.thickness = this._lineThickness;
        return line;
    }
    _getSystemPlanetsDrawingLines(controlSystemEntry) {
        const lines = [];
        for (const planet of controlSystemEntry.system.getPlanets()) {
            const playerSlot = controlSystemEntry.planetNameToOwningPlayerSlot.get(planet.getName());
            if (playerSlot !== undefined) {
                const line = this._getPlanetDrawingLine(planet, playerSlot);
                if (line) {
                    lines.push(line);
                }
            }
        }
        return lines;
    }
    getDrawingLines() {
        const lines = [];
        for (const controlSystemEntry of this._hexToControlSystemEntry.values()) {
            const systemLines = this._getSystemPlanetsDrawingLines(controlSystemEntry);
            lines.push(...systemLines);
        }
        return lines;
    }
}
exports.PlanetBorders = PlanetBorders;
//# sourceMappingURL=planet-borders.js.map