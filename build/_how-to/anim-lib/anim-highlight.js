"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimHighlight = void 0;
const api_1 = require("@tabletop-playground/api");
class AnimHighlight {
    static simple(obj, msecs) {
        const line = AnimHighlight._getOutline(obj);
        obj.addDrawingLine(line);
        return new Promise((resolve) => {
            setTimeout(() => {
                obj.removeDrawingLineObject(line);
                resolve();
            }, msecs);
        });
    }
    static _getOutline(obj) {
        const extent = obj.getExtent(false, false);
        const width = 1;
        const z = extent.z + 0.1;
        const points = [
            new api_1.Vector(extent.x + width / 2, extent.y + width / 2, z),
            new api_1.Vector(extent.x + width / 2, -extent.y - width / 2, z),
            new api_1.Vector(-extent.x - width / 2, -extent.y - width / 2, z),
            new api_1.Vector(-extent.x - width / 2, extent.y + width / 2, z),
            new api_1.Vector(extent.x + width / 2, extent.y + width / 2, z),
        ];
        const outline = new api_1.DrawingLine();
        outline.color = new api_1.Color(1, 0, 0); // Red
        outline.normals = [new api_1.Vector(0, 0, 1)];
        outline.points = points;
        outline.thickness = width;
        return outline;
    }
}
exports.AnimHighlight = AnimHighlight;
//# sourceMappingURL=anim-highlight.js.map