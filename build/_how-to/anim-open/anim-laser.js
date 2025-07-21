"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimLaser = void 0;
const api_1 = require("@tabletop-playground/api");
/**
 * Periodically show a laser beam between two game objects.
 *
 * Destroys iteslf when the source object is destroyed.
 */
class AnimLaser {
    constructor(src, dst) {
        this._lines = undefined;
        this._onTick = (obj, _deltaMsecs) => {
            if (this._lines) {
                this._lines.forEach((line) => {
                    api_1.world.removeDrawingLineObject(line);
                });
                this._lines = undefined;
                return;
            }
            if (!obj.isValid()) {
                obj.onTick.remove(this._onTick);
                return;
            }
            // Random to avoid a pattern.
            if (Math.random() > 0.15) {
                return;
            }
            const srcPos = this._src.getPosition();
            const dstPos = this._dst.getPosition();
            const getLine = (normal) => {
                const line = new api_1.DrawingLine();
                line.color = new api_1.Color(1, 0, 0, 1); // red
                line.emissiveStrength = 64; // max is 64
                line.normals = [normal];
                line.points = [srcPos, dstPos];
                line.rounded = false;
                line.thickness = 0.1;
                return line;
            };
            // Look direction is cleaner, but assumes only one player.
            this._lines = [
                getLine(new api_1.Vector(0, 0, 1)),
                getLine(new api_1.Vector(0, 0, -1)),
                getLine(new api_1.Vector(1, 0, 0)),
                getLine(new api_1.Vector(-1, 0, 0)),
                getLine(new api_1.Vector(0, 1, 0)),
                getLine(new api_1.Vector(0, -1, 0)),
            ];
            this._lines.forEach((line) => {
                api_1.world.addDrawingLine(line);
            });
        };
        this._src = src;
        this._dst = dst;
        src.onTick.add(this._onTick);
    }
}
exports.AnimLaser = AnimLaser;
//# sourceMappingURL=anim-laser.js.map