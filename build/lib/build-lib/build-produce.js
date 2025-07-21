"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildProduce = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const unit_plastic_1 = require("../unit-lib/unit-plastic/unit-plastic");
class BuildProduce {
    constructor(objs, unitAttrsSet) {
        this._entries = [];
        this._unitAttrsSet = unitAttrsSet;
        for (const obj of objs) {
            let unit = undefined;
            let count = 1;
            const plastic = unit_plastic_1.UnitPlastic.getOne(obj);
            if (plastic) {
                unit = plastic.getUnit();
            }
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "token:base/infantry-1") {
                unit = "infantry";
            }
            else if (nsid === "token:base/infantry-3") {
                unit = "infantry";
                count = 3;
            }
            else if (nsid === "token:base/fighter-1") {
                unit = "fighter";
            }
            else if (nsid === "token:base/fighter-3") {
                unit = "fighter";
                count = 3;
            }
            if (unit) {
                this._entries.push({
                    obj,
                    unit,
                    count,
                });
            }
        }
    }
    getCost() {
        const unitToCount = new Map();
        this._entries.forEach((entry) => {
            var _a;
            const unit = entry.unit;
            const count = entry.count;
            const prevCount = (_a = unitToCount.get(unit)) !== null && _a !== void 0 ? _a : 0;
            unitToCount.set(unit, prevCount + count);
        });
        const units = Array.from(unitToCount.keys()).sort();
        let totalCost = 0;
        for (const unit of units) {
            const count = unitToCount.get(unit);
            if (count !== undefined) {
                const unitAttrs = this._unitAttrsSet.get(unit);
                if (unitAttrs) {
                    const produceCount = Math.ceil(count / unitAttrs.getProducePerCost());
                    const produceCost = unitAttrs.getCost();
                    if (produceCost !== undefined) {
                        totalCost += produceCount * produceCost;
                    }
                }
            }
        }
        return totalCost;
    }
    getEntries() {
        return this._entries;
    }
    getPlasticCount() {
        let count = 0;
        this._entries.forEach((entry) => {
            count += entry.count;
        });
        return count;
    }
    moveToSystemTile(systemTileObj) {
        const r = 3.5;
        const dPhi = (Math.PI * 2) / this._entries.length;
        this._entries.forEach((entry, index) => {
            const obj = entry.obj;
            const phi = dPhi * index;
            let pos = new api_1.Vector(Math.cos(phi) * r, Math.sin(phi) * r, 0);
            pos = systemTileObj.localPositionToWorld(pos).add([0, 0, 5 + index / 2]);
            const rot = new api_1.Rotator(0, obj.getRotation().yaw, 0);
            obj.setPosition(pos, 1);
            obj.setRotation(rot, 1);
        });
    }
    report() {
        const unitToCount = new Map();
        this._entries.forEach((entry) => {
            var _a;
            const unit = entry.unit;
            const count = entry.count;
            const prevCount = (_a = unitToCount.get(unit)) !== null && _a !== void 0 ? _a : 0;
            unitToCount.set(unit, prevCount + count);
        });
        const units = Array.from(unitToCount.keys()).sort();
        const result = [];
        for (const unit of units) {
            const count = unitToCount.get(unit);
            if (count !== undefined) {
                let name = unit;
                if (count > 1 && unit !== "infantry") {
                    name += "s";
                }
                result.push(`${count} ${name}`);
            }
        }
        const totalCost = this.getCost();
        return `producing $${totalCost}: ${result.join(", ")}`;
    }
}
exports.BuildProduce = BuildProduce;
//# sourceMappingURL=build-produce.js.map