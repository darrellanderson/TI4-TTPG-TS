"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLabels = void 0;
const api_1 = require("@tabletop-playground/api");
class SystemLabels {
    static removePlanetLines() {
        for (const line of api_1.world.getDrawingLines()) {
            if (line.tag === "SystemLabels") {
                api_1.world.removeDrawingLineObject(line);
            }
        }
    }
    static getPlanetLine(planet) {
        const points = planet.getPositionAsCircle();
        const line = new api_1.DrawingLine();
        line.normals = [new api_1.Vector(0, 0, 1)];
        line.points = points;
        line.rounded = false;
        line.tag = "SystemLabels";
        line.thickness = 0.2;
        return line;
    }
    constructor(system) {
        this._uis = [];
        this._lines = [];
        this._system = system;
    }
    attach() {
        const addText = (text, pos) => {
            const ui = new api_1.UIElement();
            ui.widget = new api_1.Border().setChild(new api_1.Text().setFontSize(7 * SystemLabels.SCALE).setText(` ${text} `));
            ui.position = pos.add([0, 0, 0.2]);
            ui.scale = 1 / SystemLabels.SCALE;
            api_1.world.addUI(ui);
            this._uis.push(ui);
        };
        const addLine = (planet) => {
            const line = SystemLabels.getPlanetLine(planet);
            api_1.world.addDrawingLine(line);
            this._lines.push(line);
        };
        addText(`System ${this._system.getSystemTileNumber()}`, this._system.getObj().getPosition().add([-1.5, 0, 0]));
        for (const planet of this._system.getPlanets()) {
            addText(planet.getName(), planet.getPosition());
            for (const attachment of planet.getAttachments()) {
                addText(attachment.getName(), attachment.getObj().getPosition());
            }
            addLine(planet);
        }
        for (const getWormholesWithPositions of this._system.getWormholesWithPositions()) {
            addText(getWormholesWithPositions.wormhole, getWormholesWithPositions.position);
        }
        for (const attachment of this._system.getAttachments()) {
            addText(attachment.getName(), attachment.getObj().getPosition().add([1.5, 0, 0]));
        }
        return this;
    }
    detach() {
        for (const ui of this._uis) {
            api_1.world.removeUIElement(ui);
        }
        this._uis = [];
        for (const line of this._lines) {
            api_1.world.removeDrawingLineObject(line);
        }
        return this;
    }
}
exports.SystemLabels = SystemLabels;
SystemLabels.SCALE = 4;
//# sourceMappingURL=system-labels.js.map