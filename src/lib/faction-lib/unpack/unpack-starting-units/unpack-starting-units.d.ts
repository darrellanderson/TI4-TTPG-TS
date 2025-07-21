import { GameObject } from "@tabletop-playground/api";
import { UnitType } from "../../../unit-lib/schema/unit-attrs-schema";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
export declare class UnpackStartingUnits extends AbstractUnpack {
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    _getUnitPlasticOrThrow(unit: UnitType): GameObject;
    _findHomeSystemTileOrThrow(): GameObject;
    unpack(): void;
    remove(): void;
}
