"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitAttrs = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const combat_attrs_1 = require("./combat-attrs");
const _colorLib = new ttpg_darrell_1.ColorLib();
const _packageId = api_1.refPackageId;
/**
 * Unit attributes, e.g. cost, combat stats.
 *
 * Unlike systems, make unit attributes mutable because unit modifiers
 * can get very compliated; provide them simpler access to attributes.
 * This does mean need to regenerate unit attributes for each instance.
 */
class UnitAttrs {
    static schemaToNsid(source, schema) {
        // Should only be called for schema with nsidName.
        if (!schema.nsidName) {
            throw new Error("no nsidName");
        }
        const nsidNameFirstPart = schema.nsidName.split(".")[0];
        if (nsidNameFirstPart && nsidNameFirstPart.endsWith("-2")) {
            return `card.technology.unit-upgrade:${source}/${schema.nsidName}`;
        }
        else if (schema.unit === "mech") {
            return `card.leader.mech:${source}/${schema.nsidName}`;
        }
        else {
            return `unit:${source}/${schema.nsidName}`;
        }
    }
    static sortByOverrideOrder(attrs) {
        return attrs.sort((a, b) => {
            var _a, _b;
            const aStr = (_a = a.nsidName) !== null && _a !== void 0 ? _a : "";
            const bStr = (_b = b.nsidName) !== null && _b !== void 0 ? _b : "";
            return aStr.localeCompare(bStr);
        });
    }
    constructor(params) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        // These are (currently) only available for unit modifiers to toggle,
        // not in the initial constructor params.
        this._disableAntiFighterBarrage = false;
        this._disableBombardment = false; // different from planetary shield, outright disable always
        this._disableSpaceCannonDefense = false;
        this._disableSpaceCannonOffsense = false;
        this._disableSustainDamage = false;
        this._name = params.name;
        this._unit = params.unit;
        this._componentCount = (_a = params.componentCount) !== null && _a !== void 0 ? _a : 0;
        this._diceColor = _colorLib.parseColor((_b = params.diceColor) !== null && _b !== void 0 ? _b : "");
        this._cost = params.cost;
        this._producePerCost = (_c = params.producePerCost) !== null && _c !== void 0 ? _c : 1;
        this._produceQuantityDoesNotCountAgainstProductionLimits = 0;
        this._sharedProduceQuantityDoesNotCountAgainstProductionLimits = 0;
        this._isShip = (_d = params.isShip) !== null && _d !== void 0 ? _d : false;
        this._isGround = (_e = params.isGround) !== null && _e !== void 0 ? _e : false;
        this._hasSustainDamage = (_f = params.hasSustainDamage) !== null && _f !== void 0 ? _f : false;
        this._hasPlanetaryShield = (_g = params.hasPlanetaryShield) !== null && _g !== void 0 ? _g : false;
        this._disablePlanetaryShield = (_h = params.disablePlanetaryShield) !== null && _h !== void 0 ? _h : false;
        if (params.antiFighterBarrage) {
            this._antiFighterBarrage = new combat_attrs_1.CombatAttrs(params.antiFighterBarrage);
        }
        if (params.bombardment) {
            this._bombardment = new combat_attrs_1.CombatAttrs(params.bombardment);
        }
        if (params.spaceCannon) {
            this._spaceCannon = new combat_attrs_1.CombatAttrs(params.spaceCannon);
        }
        if (params.spaceCombat) {
            this._spaceCombat = new combat_attrs_1.CombatAttrs(params.spaceCombat);
        }
        if (params.groundCombat) {
            this._groundCombat = new combat_attrs_1.CombatAttrs(params.groundCombat);
        }
        // Truncate dice color for cleaner printing.
        if (this._diceColor) {
            this._diceColor = new api_1.Color(Math.round(this._diceColor.r * 100) / 100, Math.round(this._diceColor.g * 100) / 100, Math.round(this._diceColor.b * 100) / 100);
        }
    }
    /**
     * Apply overrides to the given attributes.
     * If an attribute is missing, do not change it.
     *
     * @param override
     * @returns
     */
    applyOverride(override) {
        if (override.cost !== undefined) {
            this._cost = override.cost;
        }
        if (override.disablePlanetaryShield) {
            this._disablePlanetaryShield = true;
        }
        if (override.hasPlanetaryShield) {
            this._hasPlanetaryShield = true;
        }
        if (override.hasSustainDamage) {
            this._hasSustainDamage = override.hasSustainDamage;
        }
        if (override.isGround) {
            this._isGround = true;
        }
        if (override.isShip) {
            this._isShip = true;
        }
        this._name = override.name;
        if (override.producePerCost) {
            this._producePerCost = override.producePerCost;
        }
        if (override.antiFighterBarrage) {
            if (!this._antiFighterBarrage) {
                this._antiFighterBarrage = new combat_attrs_1.CombatAttrs(override.antiFighterBarrage);
            }
            else {
                this._antiFighterBarrage.applyOverride(override.antiFighterBarrage);
            }
        }
        if (override.bombardment) {
            if (!this._bombardment) {
                this._bombardment = new combat_attrs_1.CombatAttrs(override.bombardment);
            }
            else {
                this._bombardment.applyOverride(override.bombardment);
            }
        }
        if (override.spaceCannon) {
            if (!this._spaceCannon) {
                this._spaceCannon = new combat_attrs_1.CombatAttrs(override.spaceCannon);
            }
            else {
                this._spaceCannon.applyOverride(override.spaceCannon);
            }
        }
        if (override.spaceCombat) {
            if (!this._spaceCombat) {
                this._spaceCombat = new combat_attrs_1.CombatAttrs(override.spaceCombat);
            }
            else {
                this._spaceCombat.applyOverride(override.spaceCombat);
            }
        }
        if (override.groundCombat) {
            if (!this._groundCombat) {
                this._groundCombat = new combat_attrs_1.CombatAttrs(override.groundCombat);
            }
            else {
                this._groundCombat.applyOverride(override.groundCombat);
            }
        }
        return this;
    }
    getAntiFighterBarrage() {
        return this._antiFighterBarrage;
    }
    getAntiFighterBarrageOrThrow() {
        if (!this._antiFighterBarrage) {
            throw new Error("no antiFighterBarrage");
        }
        return this._antiFighterBarrage;
    }
    getBombardment() {
        return this._bombardment;
    }
    getBombardmentOrThrow() {
        if (!this._bombardment) {
            throw new Error("no bombardment");
        }
        return this._bombardment;
    }
    getComponentCount() {
        return this._componentCount;
    }
    getCost() {
        return this._cost;
    }
    getDiceColor() {
        var _a;
        return (_a = this._diceColor) !== null && _a !== void 0 ? _a : new api_1.Color(0, 0, 0);
    }
    getDisableAntiFighterBarrage() {
        return this._disableAntiFighterBarrage;
    }
    getDisableBombardment() {
        return this._disableBombardment;
    }
    getDisablePlanetaryShield() {
        return this._disablePlanetaryShield;
    }
    getDisableSpaceCannonDefense() {
        return this._disableSpaceCannonDefense;
    }
    getDisableSpaceCannonOffense() {
        return this._disableSpaceCannonOffsense;
    }
    getDisableSustainDamage() {
        return this._disableSustainDamage;
    }
    getGroundCombat() {
        return this._groundCombat;
    }
    getGroundCombatOrThrow() {
        if (!this._groundCombat) {
            throw new Error("no groundCombat");
        }
        return this._groundCombat;
    }
    getImg() {
        return `unit/outlined/${this._unit}.png`;
    }
    getImgPackageId() {
        return _packageId;
    }
    getName() {
        return this._name;
    }
    getProducePerCost() {
        return this._producePerCost;
    }
    getProduceQuantityDoesNotCountAgainstProductionLimits() {
        return this._produceQuantityDoesNotCountAgainstProductionLimits;
    }
    getSharedProduceQuantityDoesNotCountAgainstProductionLimits() {
        return this._sharedProduceQuantityDoesNotCountAgainstProductionLimits;
    }
    getSpaceCannon() {
        return this._spaceCannon;
    }
    getSpaceCannonOrThrow() {
        if (!this._spaceCannon) {
            throw new Error("no spaceCannon");
        }
        return this._spaceCannon;
    }
    getSpaceCombat() {
        return this._spaceCombat;
    }
    getSpaceCombatOrThrow() {
        if (!this._spaceCombat) {
            throw new Error("no spaceCombat");
        }
        return this._spaceCombat;
    }
    getUnit() {
        return this._unit;
    }
    hasPlanetaryShild() {
        return this._hasPlanetaryShield;
    }
    hasSustainDamage() {
        return this._hasSustainDamage;
    }
    isGround() {
        return this._isGround;
    }
    isShip() {
        return this._isShip;
    }
    setAntiFighterBarrage(value) {
        this._antiFighterBarrage = value;
        return this;
    }
    setBombardment(value) {
        this._bombardment = value;
        return this;
    }
    setCost(value) {
        this._cost = value;
        return this;
    }
    setDisableAntiFighterBarrage(value) {
        this._disableAntiFighterBarrage = value;
        return this;
    }
    setDisableBombardment(value) {
        this._disableBombardment = value;
        return this;
    }
    setDisablePlanetaryShield(value) {
        this._disablePlanetaryShield = value;
        return this;
    }
    setDisableSpaceCannonDefense(value) {
        this._disableSpaceCannonDefense = value;
        return this;
    }
    setDisableSpaceCannonOffense(value) {
        this._disableSpaceCannonOffsense = value;
        return this;
    }
    setDisableSustainDamage(value) {
        this._disableSustainDamage = value;
        return this;
    }
    setGroundCombat(value) {
        this._groundCombat = value;
        return this;
    }
    setHasPlanetaryShield(value) {
        this._hasPlanetaryShield = value;
        return this;
    }
    setHasSustainDamage(value) {
        this._hasSustainDamage = value;
        return this;
    }
    setIsGround(value) {
        this._isGround = value;
        return this;
    }
    setIsShip(value) {
        this._isShip = value;
        return this;
    }
    setProducePerCost(value) {
        this._producePerCost = value;
        return this;
    }
    setProduceQuantityDoesNotCountAgainstProductionLimits(value) {
        this._produceQuantityDoesNotCountAgainstProductionLimits = value;
        return this;
    }
    setSharedProduceQuantityDoesNotCountAgainstProductionLimits(value) {
        this._sharedProduceQuantityDoesNotCountAgainstProductionLimits = value;
        return this;
    }
    setSpaceCannon(value) {
        this._spaceCannon = value;
        return this;
    }
    setSpaceCombat(value) {
        this._spaceCombat = value;
        return this;
    }
}
exports.UnitAttrs = UnitAttrs;
//# sourceMappingURL=unit-attrs.js.map