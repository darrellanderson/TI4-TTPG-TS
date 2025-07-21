"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackStartingUnits = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
class UnpackStartingUnits extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    _getUnitPlasticOrThrow(unit) {
        const source = unit === "mech" ? "pok" : "base";
        const nsid = `container.unit:${source}/${unit}`;
        const skipContained = true;
        const container = this._find.findContainer(nsid, this.getPlayerSlot(), skipContained);
        if (!container) {
            throw new Error(`Could not find container for ${unit}/${this.getPlayerSlot()}`);
        }
        const obj = container.takeAt(0, [0, 0, 0]);
        if (!obj) {
            throw new Error(`Could not find plastic for ${unit}/${this.getPlayerSlot()}`);
        }
        return obj;
    }
    _findHomeSystemTileOrThrow() {
        const playerSlot = this.getPlayerSlot();
        const systemTileObj = this.getFaction().getHomeSystemTileObj(playerSlot);
        if (!systemTileObj) {
            throw new Error(`Could not find home system tile for ${this.getPlayerSlot()}`);
        }
        return systemTileObj;
    }
    unpack() {
        const systemTileObj = this._findHomeSystemTileOrThrow();
        const unitObjs = [];
        const startingUnits = this.getFaction().getStartingUnits();
        for (const [unit, count] of Object.entries(startingUnits)) {
            for (let i = 0; i < count; i++) {
                const obj = this._getUnitPlasticOrThrow(unit);
                obj.setOwningPlayerSlot(this.getPlayerSlot());
                unitObjs.push(obj);
            }
        }
        const rotate = 360 / (unitObjs.length + 1);
        let localPos = new api_1.Vector(5, 0, 10);
        for (const obj of unitObjs) {
            const pos = systemTileObj.localPositionToWorld(localPos);
            obj.setPosition(pos);
            obj.snapToGround();
            localPos = localPos.rotateAngleAxis(rotate, [0, 0, 1]);
        }
    }
    remove() {
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("unit:") &&
                obj.getOwningPlayerSlot() === this.getPlayerSlot() &&
                obj.getContainer() === undefined // loose on table
            ) {
                ttpg_darrell_1.GarbageContainer.tryRecycle(obj, undefined);
            }
        }
    }
}
exports.UnpackStartingUnits = UnpackStartingUnits;
//# sourceMappingURL=unpack-starting-units.js.map