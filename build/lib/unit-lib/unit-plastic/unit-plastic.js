"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitPlastic = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const unit_attrs_schema_1 = require("../schema/unit-attrs-schema");
const on_system_activated_1 = require("../../../event/on-system-activated/on-system-activated");
/**
 * Represents a single game object corresponding to a unit plastic.
 * It might be an anonymous (no owning player slot) cardboard token,
 * optionally assign those to the closest same-hex owned unit plastic.
 */
class UnitPlastic {
    /**
     * Convert a game object to a unit plastic entry (is it applies).
     *
     * @param obj
     * @returns
     */
    static getOne(obj) {
        let unit = undefined;
        let count = 1;
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("unit:")) {
            const parsed = ttpg_darrell_1.NSID.parse(nsid);
            const maybeUnit = parsed === null || parsed === void 0 ? void 0 : parsed.nameParts[0];
            if (unit_attrs_schema_1.UnitSchema.safeParse(maybeUnit).success) {
                unit = maybeUnit;
            }
        }
        else if (nsid.startsWith("token:base/")) {
            switch (nsid) {
                case "token:base/infantry-1":
                    unit = "infantry";
                    break;
                case "token:base/infantry-3":
                    unit = "infantry";
                    count = 3;
                    break;
                case "token:base/fighter-1":
                    unit = "fighter";
                    break;
                case "token:base/fighter-3":
                    unit = "fighter";
                    count = 3;
                    break;
            }
        }
        else if (nsid.startsWith("token.control:")) {
            unit = "control-token";
        }
        if (unit) {
            let pos = obj.getPosition();
            const skipContained = true;
            const combatArena = this.__find.findGameObject("mat:base/combat-arena", undefined, skipContained);
            const system = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
            if (combatArena && system) {
                const localPos = combatArena.worldPositionToLocal(pos);
                const extent = combatArena.getExtent(false, false);
                if (Math.abs(localPos.x) < extent.x &&
                    Math.abs(localPos.y) < extent.y) {
                    const systemTileObj = system.getObj();
                    const tileExtent = systemTileObj.getExtent(false, false);
                    localPos.x *= tileExtent.x / extent.x;
                    localPos.y *= tileExtent.y / extent.y;
                    pos = systemTileObj.localPositionToWorld(localPos);
                }
            }
            return new UnitPlastic(unit, count, obj, pos);
        }
        return undefined;
    }
    /**
     * Find all unit plastics on the table (not in containers).
     * Does not assign token owners or planets, expecting the
     * caller to prune down to relevant entries and assign those.
     *
     * @returns
     */
    static getAll() {
        const result = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const maybeEntry = this.getOne(obj);
            if (maybeEntry) {
                result.push(maybeEntry);
            }
        }
        return result;
    }
    /**
     * Assign ownership of anonymous cardboard tokens to the closest
     * same-hex owned unit plastic.
     *
     * @param entries
     */
    static assignOwners(entries) {
        const hexToEntries = new Map();
        for (const entry of entries) {
            const hex = entry._hex;
            let hexEntries = hexToEntries.get(hex);
            if (!hexEntries) {
                hexEntries = [];
                hexToEntries.set(hex, hexEntries);
            }
            hexEntries.push(entry);
        }
        for (const hexEntries of hexToEntries.values()) {
            for (const entry of hexEntries) {
                if (entry._owningPlayerSlot < 0) {
                    let bestPlayerSlot = -1;
                    let bestDSq = Number.MAX_VALUE;
                    const p0 = entry._pos;
                    for (const other of hexEntries) {
                        if (other._owningPlayerSlot >= 0) {
                            const p1 = other._pos;
                            const dSq = p0.subtract(p1).magnitudeSquared();
                            if (dSq < bestDSq) {
                                bestDSq = dSq;
                                bestPlayerSlot = other._owningPlayerSlot;
                            }
                        }
                    }
                    // May still be -1 if no other player-owned units are present.
                    entry._owningPlayerSlot = bestPlayerSlot;
                }
            }
        }
    }
    /**
     * Assign planets to unit plastics, both closest and exact.
     *
     * @param entries
     */
    static assignPlanets(entries) {
        const systems = TI4.systemRegistry.getAllSystemsWithObjs();
        const hexToSystem = new Map();
        for (const system of systems) {
            const hex = TI4.hex.fromPosition(system.getObj().getPosition());
            hexToSystem.set(hex, system);
        }
        for (const entry of entries) {
            const system = hexToSystem.get(entry._hex);
            if (system) {
                const pos = entry._pos;
                entry._system = system;
                entry._planetClosest = system.getPlanetClosest(pos);
                entry._planetExact = system.getPlanetExact(pos);
            }
        }
    }
    constructor(unit, count, obj, pos) {
        this._unit = unit;
        this._count = count;
        this._obj = obj;
        this._pos = pos;
        this._hex = TI4.hex.fromPosition(pos);
        this._owningPlayerSlot = obj.getOwningPlayerSlot();
        this._planetClosest = undefined;
        this._planetExact = undefined;
    }
    getCount() {
        return this._count;
    }
    getHex() {
        return this._hex;
    }
    getPos() {
        return this._pos;
    }
    getObj() {
        return this._obj;
    }
    getOwningPlayerSlot() {
        return this._owningPlayerSlot;
    }
    getPlanetClosest() {
        return this._planetClosest;
    }
    getPlanetExact() {
        return this._planetExact;
    }
    getSystem() {
        return this._system;
    }
    getUnit() {
        return this._unit;
    }
}
exports.UnitPlastic = UnitPlastic;
UnitPlastic.__find = new ttpg_darrell_1.Find();
//# sourceMappingURL=unit-plastic.js.map