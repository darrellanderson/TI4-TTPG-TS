"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemReserveSpace = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Lift and drop objects over a system tile.
 * Used to reserve space for system/planet attachments.
 */
class SystemReserveSpace {
    constructor(systemTileObj) {
        this._liftedObjs = [];
        this._systemTileObj = systemTileObj;
    }
    lift() {
        // Lift everything (except the system tile) in the area.
        // Sort by z position (bottom to top).
        const pos = this._systemTileObj.getPosition();
        const hex = TI4.hex.fromPosition(pos);
        const extent = this._systemTileObj.getExtent(true, false);
        extent.z = 10;
        this._liftedObjs = api_1.world
            .boxOverlap(pos, extent)
            .filter((obj) => {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const objPos = obj.getPosition();
            const objHex = TI4.hex.fromPosition(objPos);
            return !nsid.startsWith("tile.system:") && objHex === hex;
        })
            .sort((a, b) => a.getPosition().z - b.getPosition().z);
        for (const obj of this._liftedObjs) {
            const above = obj.getPosition().add(new api_1.Vector(0, 0, 5));
            obj.setObjectType(api_1.ObjectType.Regular);
            obj.setPosition(above);
        }
        return this;
    }
    drop() {
        // Drop everything lifted (in bottom to top order).
        for (const obj of this._liftedObjs) {
            obj.snapToGround();
        }
        this._liftedObjs = [];
        return this;
    }
}
exports.SystemReserveSpace = SystemReserveSpace;
//# sourceMappingURL=system-reserve-space.js.map