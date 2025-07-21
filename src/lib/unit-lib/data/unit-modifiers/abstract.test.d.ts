/**
 * Utility functions to simplify unit modifier tests.
 * Use the ".test.ts" naming to prevent including in the mod build.
 */
import { Vector } from "@tabletop-playground/api";
import { UnitType } from "../../schema/unit-attrs-schema";
export declare const SELF: number;
export declare const OPPONENT: number;
export declare const SELF_POS: Vector;
export declare const OPPONENT_POS: Vector;
export declare const ANY_POS: Vector;
export declare function placeGameObjects(params: {
    systemNsid?: string;
    self?: Array<string>;
    selfActive?: Array<string>;
    selfUnits?: Map<UnitType, number>;
    selfUnitsOffPlanet?: Map<UnitType, number>;
    selfUnitsAdj?: Map<UnitType, number>;
    opponent?: Array<string>;
    opponentUnits?: Map<UnitType, number>;
    opponentUnitsOffPlanet?: Map<UnitType, number>;
    opponentUnitsAdj?: Map<UnitType, number>;
    any?: Array<string>;
}): void;
