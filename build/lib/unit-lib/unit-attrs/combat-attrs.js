"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatAttrs = void 0;
class CombatAttrs {
    constructor(params) {
        var _a, _b, _c, _d, _e;
        this._dice = (_a = params.dice) !== null && _a !== void 0 ? _a : 1; // N dice per object
        this._hit = params.hit; // hit in N or better
        this._extraDice = (_b = params.extraDice) !== null && _b !== void 0 ? _b : 0; // N extra dice overall (not per object)
        this._rerollMisses = (_c = params.rerollMisses) !== null && _c !== void 0 ? _c : false;
        this._crit = params.crit; // crit on N or better, e.g. jol-nar flagship
        this._critCount = (_d = params.critCount) !== null && _d !== void 0 ? _d : 0; // N extra hits on crit
        this._range = (_e = params.range) !== null && _e !== void 0 ? _e : 0; // range in hexes: 0=local, 1=adjacent
    }
    /**
     * Apply overrides to the given attributes.
     * If an attribute is missing, do not change it.
     *
     * @param override
     * @returns
     */
    applyOverride(override) {
        if (override.crit !== undefined) {
            this._crit = override.crit;
        }
        if (override.critCount !== undefined) {
            this._critCount = override.critCount;
        }
        if (override.dice !== undefined) {
            this._dice = override.dice;
        }
        if (override.extraDice !== undefined) {
            this._extraDice = override.extraDice;
        }
        if (override.hit !== undefined) {
            this._hit = override.hit;
        }
        if (override.rerollMisses) {
            this._rerollMisses = true;
        }
        if (override.range !== undefined) {
            this._range = override.range;
        }
        return this;
    }
    addHit(delta) {
        this._hit -= delta; // "add" means die hits on a lower number
        return this;
    }
    addDice(delta) {
        this._dice += delta;
        return this;
    }
    addExtraDice(delta) {
        this._extraDice += delta;
        return this;
    }
    getCrit() {
        return this._crit;
    }
    getCritCount() {
        return this._critCount;
    }
    getDice() {
        return this._dice;
    }
    getExtraDice() {
        return this._extraDice;
    }
    getHit() {
        return this._hit;
    }
    getRange() {
        return this._range;
    }
    getRerollMisses() {
        return this._rerollMisses;
    }
    setCrit(value) {
        this._crit = value;
        return this;
    }
    setCritCount(value) {
        this._critCount = value;
        return this;
    }
    setDice(value) {
        this._dice = value;
        return this;
    }
    setExtraDice(value) {
        this._extraDice = value;
        return this;
    }
    setHit(value) {
        this._hit = value;
        return this;
    }
    setRange(value) {
        this._range = value;
        return this;
    }
    setRerollMisses(value) {
        this._rerollMisses = value;
        return this;
    }
}
exports.CombatAttrs = CombatAttrs;
//# sourceMappingURL=combat-attrs.js.map