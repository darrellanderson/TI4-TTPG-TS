"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceBuildHelper = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const system_summary_1 = require("../lib/system-lib/system/system-summary");
const SCALE = 2;
class SliceBuildHelper {
    constructor(obj) {
        this._obj = obj;
        this._text = new api_1.Text()
            .setAutoWrap(false)
            .setFontSize(10 * SCALE)
            .setJustification(api_1.TextJustification.Center)
            .setTextColor([0, 0, 0, 1]);
        const widget = new api_1.LayoutBox()
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(this._text);
        const z = obj.getExtent(false, false).z;
        const ui = new api_1.UIElement();
        ui.position = new api_1.Vector(0, 0, z + 0.1);
        ui.scale = 1 / SCALE;
        ui.widget = widget;
        obj.addUI(ui);
        this._intervalHandle = setInterval(() => {
            this.update();
        }, 1000);
        obj.onDestroyed.add(() => {
            clearInterval(this._intervalHandle);
        });
    }
    update() {
        const systems = this._getTransitiveAdjacentSystems();
        const summary = new system_summary_1.SystemSummary(systems).getSummaryRaw();
        let name = this._obj.getName();
        if (name.length === 0) {
            name = "<name>";
        }
        const result = [
            name,
            `${summary.resources}/${summary.influence}`,
            `(${summary.optResources}/${summary.optInfluence})`,
        ];
        result.push(`Tech: ${summary.techs}`);
        result.push(`Traits: ${summary.traits}`);
        result.push(`Wormholes: ${summary.wormholes}`);
        result.push(`Legendaries: ${summary.legendary.length}`);
        const value = result.join("\n");
        this._text.setText(value);
    }
    _getHexToSystem() {
        const hexToSystem = new Map();
        const systems = TI4.systemRegistry.getAllSystemsWithObjs();
        for (const system of systems) {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            hexToSystem.set(hex, system);
        }
        return hexToSystem;
    }
    _getTransitiveAdjacentSystems() {
        const toVisit = new Set();
        const visited = new Set();
        // Seed with our hex.
        const objPos = this._obj.getPosition();
        const objHex = TI4.hex.fromPosition(objPos);
        for (const neighbor of ttpg_darrell_1.Hex.neighbors(objHex)) {
            toVisit.add(neighbor);
        }
        const hexToSystem = this._getHexToSystem();
        const result = [];
        while (toVisit.size > 0) {
            const hex = toVisit.values().next().value;
            if (hex) {
                toVisit.delete(hex);
                visited.add(hex);
                // Check hex.
                const system = hexToSystem.get(hex);
                if (!system) {
                    continue;
                }
                result.push(system);
                // Expand to neighbors.
                for (const neighbor of ttpg_darrell_1.Hex.neighbors(hex)) {
                    if (!visited.has(neighbor)) {
                        toVisit.add(neighbor);
                    }
                }
            }
        }
        return result;
    }
}
exports.SliceBuildHelper = SliceBuildHelper;
new SliceBuildHelper(api_1.refObject);
//# sourceMappingURL=slice-build-helper.js.map