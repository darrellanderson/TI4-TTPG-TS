"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllBorders = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const space_planet_ownership_1 = require("../space-planet-ownership/space-planet-ownership");
const space_borders_1 = require("../space-borders/space-borders");
const planet_borders_1 = require("../planet-borders/planet-borders");
const LINE_TAG = "__border__";
const LINE_THICKNESS = 0.2;
const STATE_KEY = "allBorders";
/**
 * Manage the actual control border DrawingLines.
 * DrawingLines persist across save/load/rewind so
 * we only need to update them in place.
 */
class AllBorders {
    static getAllDrawingLines() {
        return api_1.world.getDrawingLines().filter((line) => {
            return line.tag === LINE_TAG;
        });
    }
    static removeAllDrawingLines() {
        for (const line of AllBorders.getAllDrawingLines()) {
            api_1.world.removeDrawingLineObject(line);
        }
    }
    constructor() {
        this._visibleTo = [];
        this._onTurnChangedHandler = () => {
            this._updateLines();
        };
        this._restore();
    }
    init() {
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.add(this._onTurnChangedHandler);
    }
    destroy() {
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.remove(this._onTurnChangedHandler);
        // leave world saved data alone so we can restore on init
    }
    _save() {
        const json = JSON.stringify(this._visibleTo);
        api_1.world.setSavedData(json, STATE_KEY);
    }
    _restore() {
        const json = api_1.world.getSavedData(STATE_KEY);
        if (json && json.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this._visibleTo = JSON.parse(json);
        }
    }
    _updateLines() {
        AllBorders.removeAllDrawingLines();
        if (this._visibleTo.length > 0) {
            const visibleTo = new api_1.PlayerPermission().setPlayerSlots(this._visibleTo);
            const hexToControlSystemEntry = new space_planet_ownership_1.SpacePlanetOwnership().getHexToControlSystemEntry();
            const spaceLines = new space_borders_1.SpaceBorders(hexToControlSystemEntry, LINE_THICKNESS).getDrawingLines();
            const planetLines = new planet_borders_1.PlanetBorders(hexToControlSystemEntry, LINE_THICKNESS).getDrawingLines();
            const lines = [...spaceLines, ...planetLines];
            for (const line of lines) {
                line.players = visibleTo;
                line.tag = LINE_TAG;
                api_1.world.addDrawingLine(line);
            }
        }
    }
    isVisibleTo(playerSlot) {
        return this._visibleTo.includes(playerSlot);
    }
    toggleVisibility(playerSlot) {
        const index = this._visibleTo.indexOf(playerSlot);
        if (index >= 0) {
            this._visibleTo.splice(index, 1);
        }
        else {
            this._visibleTo.push(playerSlot);
        }
        this._save();
        // We could update the lines in place (still need to remove, edit, and
        // re-add for the player permission change) but it's easier to just
        // remove and recreate all lines.
        this._updateLines();
    }
}
exports.AllBorders = AllBorders;
//# sourceMappingURL=all-borders.js.map