import { GameObject } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";
/**
 * Represent a GameObject that exerts control over a planet or space area.
 */
export type ControlObjType = {
    obj: GameObject;
    owningPlayerSlot: PlayerSlot;
    hex: HexType;
    system: System;
    planet: Planet | undefined;
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
export declare class SpacePlanetOwnership {
    private readonly _hexToSystem;
    constructor();
    _createControlTypeFromUnitPlastic(unitPlastic: UnitPlastic): ControlObjType | undefined;
    _createControlTypeFromControlToken(controlToken: GameObject): ControlObjType | undefined;
    _getAllControlEntries(): Array<ControlObjType>;
    getHexToControlSystemEntry(): Map<HexType, ControlSystemType>;
}
