"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacePlanetOwnership = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const unit_plastic_1 = require("../../unit-lib/unit-plastic/unit-plastic");
/**
 * Calculate per-hex control of space and planets.
 * Should be recreated for each use in case hex-to-system changed.
 */
class SpacePlanetOwnership {
    constructor() {
        this._hexToSystem = new Map();
        const skipContained = true;
        const systems = TI4.systemRegistry.getAllSystemsWithObjs(skipContained);
        for (const system of systems) {
            const obj = system.getObj();
            const pos = obj.getPosition();
            const hex = TI4.hex.fromPosition(pos);
            this._hexToSystem.set(hex, system);
        }
    }
    _createControlTypeFromUnitPlastic(unitPlastic) {
        const hex = unitPlastic.getHex();
        const system = this._hexToSystem.get(hex);
        if (!system) {
            return undefined;
        }
        const result = {
            obj: unitPlastic.getObj(),
            owningPlayerSlot: unitPlastic.getOwningPlayerSlot(),
            hex,
            system,
            planet: undefined,
        };
        const unitType = unitPlastic.getUnit();
        const unitAttrs = TI4.unitAttrsRegistry
            .defaultUnitAttrsSet()
            .getOrThrow(unitType);
        if (!unitAttrs.isShip()) {
            result.planet = unitPlastic.getPlanetClosest();
        }
        return result;
    }
    _createControlTypeFromControlToken(controlToken) {
        const nsid = ttpg_darrell_1.NSID.get(controlToken);
        if (nsid !== "token:base/control") {
            return undefined;
        }
        const pos = controlToken.getPosition();
        const hex = TI4.hex.fromPosition(pos);
        const system = this._hexToSystem.get(hex);
        if (!system) {
            return undefined;
        }
        const planet = system.getPlanetClosest(pos);
        return {
            obj: controlToken,
            owningPlayerSlot: controlToken.getOwningPlayerSlot(),
            hex,
            system,
            planet,
        };
    }
    _getAllControlEntries() {
        const result = [];
        const plastics = unit_plastic_1.UnitPlastic.getAll();
        unit_plastic_1.UnitPlastic.assignPlanets(plastics);
        for (const plastic of plastics) {
            const controlType = this._createControlTypeFromUnitPlastic(plastic);
            if (controlType) {
                result.push(controlType);
            }
        }
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const controlType = this._createControlTypeFromControlToken(obj);
            if (controlType) {
                result.push(controlType);
            }
        }
        return result;
    }
    getHexToControlSystemEntry() {
        const hexToControlSystemEntry = new Map();
        for (const [hex, system] of this._hexToSystem) {
            const planetNameToOwningPlayerSlot = new Map();
            for (const planet of system.getPlanets()) {
                planetNameToOwningPlayerSlot.set(planet.getName(), -1);
            }
            const controlSystemType = {
                hex,
                system,
                spaceOwningPlayerSlot: -1,
                planetNameToOwningPlayerSlot,
            };
            hexToControlSystemEntry.set(hex, controlSystemType);
        }
        const controlEntries = this._getAllControlEntries();
        for (const controlEntry of controlEntries) {
            const hex = controlEntry.hex;
            const controlSystemType = hexToControlSystemEntry.get(hex);
            if (controlSystemType) {
                // Space control.
                if (controlEntry.planet === undefined) {
                    if (controlSystemType.spaceOwningPlayerSlot === -1) {
                        controlSystemType.spaceOwningPlayerSlot =
                            controlEntry.owningPlayerSlot;
                    }
                    else if (controlSystemType.spaceOwningPlayerSlot >= 0 &&
                        controlSystemType.spaceOwningPlayerSlot !==
                            controlEntry.owningPlayerSlot) {
                        // Multiple control entries with different slots.
                        controlSystemType.spaceOwningPlayerSlot = -2;
                    }
                }
                // Planet control.
                if (controlEntry.planet) {
                    const planetName = controlEntry.planet.getName();
                    const oldOwner = controlSystemType.planetNameToOwningPlayerSlot.get(planetName);
                    const newOwner = controlEntry.owningPlayerSlot;
                    if (oldOwner === undefined || oldOwner === -1) {
                        controlSystemType.planetNameToOwningPlayerSlot.set(planetName, newOwner);
                    }
                    else if (oldOwner !== newOwner) {
                        // Multiple control entries with different slots.
                        controlSystemType.planetNameToOwningPlayerSlot.set(planetName, -2);
                    }
                }
            }
        }
        return hexToControlSystemEntry;
    }
}
exports.SpacePlanetOwnership = SpacePlanetOwnership;
//# sourceMappingURL=space-planet-ownership.js.map