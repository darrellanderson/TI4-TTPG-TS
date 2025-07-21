"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HideMouseCursor = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class HideMouseCursor {
    constructor(namespaceId) {
        this._hideCursorPlayerNames = new Set();
        this._updateZoneHandler = () => {
            this._updateZone();
        };
        this._namespaceId = namespaceId;
        this._load();
    }
    init() {
        this._zone = HideMouseCursor._findOrCreateZone();
        this._updateZone();
        api_1.globalEvents.onPlayerJoined.add(this._updateZoneHandler);
        api_1.globalEvents.onPlayerLeft.add(this._updateZoneHandler);
        api_1.globalEvents.onPlayerSwitchedSlots.add(this._updateZoneHandler);
    }
    addHideCursor(player) {
        this._hideCursorPlayerNames.add(player.getName());
        this._save();
        this._updateZone();
    }
    hasHideCursor(player) {
        return this._hideCursorPlayerNames.has(player.getName());
    }
    removeHideCursor(player) {
        this._hideCursorPlayerNames.delete(player.getName());
        this._save();
        this._updateZone();
    }
    _updateZone() {
        if (this._zone) {
            for (let i = 0; i < 20; i++) {
                this._zone.setSlotOwns(i, false);
            }
            for (const playerName of this._hideCursorPlayerNames) {
                const player = api_1.world.getPlayerByName(playerName);
                if (player) {
                    this._zone.setSlotOwns(player.getSlot(), true);
                }
            }
        }
    }
    _save() {
        const json = JSON.stringify(Array.from(this._hideCursorPlayerNames));
        api_1.world.setSavedData(json, this._namespaceId);
    }
    _load() {
        const json = api_1.world.getSavedData(this._namespaceId);
        if (json && json.length > 0) {
            const names = JSON.parse(json);
            this._hideCursorPlayerNames.clear();
            for (const name of names) {
                this._hideCursorPlayerNames.add(name);
            }
        }
    }
    static _getTablePositionAndExtent() {
        const result = {
            tablePosition: new api_1.Vector(0, 0, 0),
            tableExtent: new api_1.Vector(0, 0, 0),
        };
        // Find the table (by NSID).
        const currentRotation = true;
        const includeGeometry = true;
        for (const table of api_1.world.getAllTables()) {
            const nsid = ttpg_darrell_1.NSID.get(table);
            if (nsid === "table:base/table") {
                result.tablePosition = table.getPosition();
                result.tableExtent = table.getExtent(currentRotation, includeGeometry);
            }
        }
        return result;
    }
    static _findOrCreateZone() {
        const zoneId = "__hide_mouse_cursor__";
        const zoneHeight = 10;
        // Find the table (by NSID).
        const { tableExtent } = HideMouseCursor._getTablePositionAndExtent();
        // Find zone.
        let zone;
        for (const candidate of api_1.world.getAllZones()) {
            if (candidate.isValid() && candidate.getId() === zoneId) {
                zone = candidate;
                break;
            }
        }
        // Create zone if it doesn't exist.
        const pos = new api_1.Vector(0, 0, api_1.world.getTableHeight() + zoneHeight / 2 - 1);
        if (!zone) {
            zone = api_1.world.createZone(pos);
            zone.setId(zoneId);
            zone.setCursorHidden(api_1.ZonePermission.OwnersOnly);
        }
        // Always update pos/size.
        zone.setPosition(pos);
        zone.setScale([
            tableExtent.x * 2 - 0.1,
            tableExtent.y * 2 - 0.1,
            zoneHeight,
        ]);
        // Visualize for initial testing?
        zone.setColor([0, 1, 0, 0.5]);
        zone.setAlwaysVisible(false);
        return zone;
    }
}
exports.HideMouseCursor = HideMouseCursor;
//# sourceMappingURL=hide-mouse-cursor.js.map