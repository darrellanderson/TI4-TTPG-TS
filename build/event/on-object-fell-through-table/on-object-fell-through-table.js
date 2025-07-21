"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnObjectFellThroughTable = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class OnObjectFellThroughTable {
    constructor() {
        this._relocateTo = new api_1.Vector(0, 0, 0);
        this._onBeginOverlapHandler = (_zone, object) => {
            const objPos = object.getPosition();
            if (objPos.x === 0 && objPos.y === 0 && objPos.z === 0) {
                return; // "f"lip moves the object to the origin briefly.
            }
            // Move above table.
            const pos = new api_1.Vector(this._relocateTo.x, this._relocateTo.y, api_1.world.getTableHeight() + 10);
            object.setPosition(pos);
            object.snapToGround();
            const nsid = ttpg_darrell_1.NSID.get(object);
            const msg = `"${nsid}" fell through the table`;
            ttpg_darrell_1.ErrorHandler.onError.trigger(msg);
            // Tell any listeners that the object fell through the table.
            TI4.events.onObjectFellThroughTable.trigger(object);
        };
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
        const zoneId = "__below_table__";
        // Find the table (by NSID).
        const { tablePosition, tableExtent } = OnObjectFellThroughTable._getTablePositionAndExtent();
        const tableHeight = Math.max(api_1.world.getTableHeight(), tablePosition.z + tableExtent.z);
        // Find zone.
        let zone;
        for (const candidate of api_1.world.getAllZones()) {
            if (candidate.isValid() && candidate.getId() === zoneId) {
                zone = candidate;
                break;
            }
        }
        // Create zone if it doesn't exist.
        const pos = new api_1.Vector(0, 0, tableHeight / 2 - 3);
        if (!zone) {
            zone = api_1.world.createZone(pos);
            zone.setId(zoneId);
        }
        // Always update pos/size.
        zone.setPosition(pos);
        zone.setScale([
            tableExtent.x * 2 - 0.1,
            tableExtent.y * 2 - 0.1,
            tableHeight,
        ]);
        // Visualize for initial testing?
        zone.setColor([1, 0, 0, 0.5]);
        zone.setAlwaysVisible(false);
        return zone;
    }
    /**
     * Destroy the zone (will be recreated on next load).
     * This can be useful for testing, or before doing bulk setup that may create
     * things at the origin (below the table).
     */
    static destroyZone() {
        const zone = OnObjectFellThroughTable._findOrCreateZone();
        zone.destroy();
    }
    init() {
        const zone = OnObjectFellThroughTable._findOrCreateZone();
        zone.getOverlappingObjects().forEach((object) => {
            this._onBeginOverlapHandler(zone, object);
        });
        zone.onBeginOverlap.add(this._onBeginOverlapHandler);
    }
    setRelocateTo(position) {
        this._relocateTo = position;
        return this;
    }
}
exports.OnObjectFellThroughTable = OnObjectFellThroughTable;
//# sourceMappingURL=on-object-fell-through-table.js.map