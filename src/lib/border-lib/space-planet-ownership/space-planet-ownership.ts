import { GameObject, Vector } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";

import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrsSet } from "../../unit-lib";

/**
 * Represent a GameObject that exerts control over a planet or space area.
 */
export type ControlObjType = {
  obj: GameObject;
  owningPlayerSlot: PlayerSlot;
  hex: HexType;
  system: System;
  planet: Planet | undefined; // undefined for space control
};

/**
 * Summarizes system control: who owns the space, and who owns each planet.
 * -1 = no control, -2 = multiple players (player slot for normal control).
 */
export type ControlSystemType = {
  hex: HexType;
  system: System;
  spaceOwningPlayerSlot: PlayerSlot;
  planetNameToOwningPlayerSlot: Map<string, PlayerSlot>;
};

/**
 * Calculate per-hex control of space and planets.
 * Should be recreated for each use in case hex-to-system changed.
 */
export class SpacePlanetOwnership {
  private readonly _hexToSystem: Map<HexType, System> = new Map();
  private readonly _unitAttrsSet: UnitAttrsSet;

  constructor() {
    const skipContained: boolean = true;
    const systems: Array<System> =
      TI4.systemRegistry.getAllSystemsWithObjs(skipContained);
    for (const system of systems) {
      const obj: GameObject = system.getObj();
      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      this._hexToSystem.set(hex, system);
    }
    this._unitAttrsSet = TI4.unitAttrsRegistry.defaultUnitAttrsSet();
  }

  _createControlTypeFromUnitPlastic(
    unitPlastic: UnitPlastic
  ): ControlObjType | undefined {
    const hex: HexType = unitPlastic.getHex();
    const system: System | undefined = this._hexToSystem.get(hex);
    if (!system) {
      return undefined;
    }

    const result: ControlObjType = {
      obj: unitPlastic.getObj(),
      owningPlayerSlot: unitPlastic.getOwningPlayerSlot(),
      hex,
      system,
      planet: undefined,
    };

    const unitType: UnitType = unitPlastic.getUnit();
    const unitAttrs: UnitAttrs | undefined = this._unitAttrsSet.get(unitType);
    if (unitType === "control-token" || (unitAttrs && !unitAttrs.isShip())) {
      result.planet = unitPlastic.getPlanetClosest();
    }
    return result;
  }

  _getAllControlEntries(): Array<ControlObjType> {
    const result: Array<ControlObjType> = [];

    const plastics: Array<UnitPlastic> = UnitPlastic.getAll();
    UnitPlastic.assignPlanets(plastics);
    for (const plastic of plastics) {
      const controlType: ControlObjType | undefined =
        this._createControlTypeFromUnitPlastic(plastic);
      if (controlType) {
        result.push(controlType);
      }
    }

    return result;
  }

  getHexToControlSystemEntry(): Map<HexType, ControlSystemType> {
    const hexToControlSystemEntry: Map<HexType, ControlSystemType> = new Map();

    for (const [hex, system] of this._hexToSystem) {
      const planetNameToOwningPlayerSlot: Map<string, PlayerSlot> = new Map();
      for (const planet of system.getPlanets()) {
        planetNameToOwningPlayerSlot.set(planet.getName(), -1);
      }
      const controlSystemType: ControlSystemType = {
        hex,
        system,
        spaceOwningPlayerSlot: -1,
        planetNameToOwningPlayerSlot,
      };
      hexToControlSystemEntry.set(hex, controlSystemType);
    }

    const controlEntries: Array<ControlObjType> = this._getAllControlEntries();
    for (const controlEntry of controlEntries) {
      const hex: HexType = controlEntry.hex;
      const controlSystemType: ControlSystemType | undefined =
        hexToControlSystemEntry.get(hex);
      if (controlSystemType) {
        // Space control.
        if (controlEntry.planet === undefined) {
          if (controlSystemType.spaceOwningPlayerSlot === -1) {
            controlSystemType.spaceOwningPlayerSlot =
              controlEntry.owningPlayerSlot;
          } else if (
            controlSystemType.spaceOwningPlayerSlot >= 0 &&
            controlSystemType.spaceOwningPlayerSlot !==
              controlEntry.owningPlayerSlot
          ) {
            // Multiple control entries with different slots.
            controlSystemType.spaceOwningPlayerSlot = -2;
          }
        }

        // Planet control.
        if (controlEntry.planet) {
          const planetName: string = controlEntry.planet.getName();
          const oldOwner: PlayerSlot | undefined =
            controlSystemType.planetNameToOwningPlayerSlot.get(planetName);
          const newOwner: PlayerSlot = controlEntry.owningPlayerSlot;
          if (oldOwner === undefined || oldOwner === -1) {
            controlSystemType.planetNameToOwningPlayerSlot.set(
              planetName,
              newOwner
            );
          } else if (oldOwner !== newOwner) {
            // Multiple control entries with different slots.
            controlSystemType.planetNameToOwningPlayerSlot.set(planetName, -2);
          }
        }
      }
    }

    return hexToControlSystemEntry;
  }
}
