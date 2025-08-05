import { GameObject, Vector } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { UnitType } from "../schema/unit-attrs-schema";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";
/**
 * Represents a single game object corresponding to a unit plastic.
 * It might be an anonymous (no owning player slot) cardboard token,
 * optionally assign those to the closest same-hex owned unit plastic.
 */
export declare class UnitPlastic {
    private static readonly __find;
    private readonly _unit;
    private readonly _count;
    private readonly _obj;
    private readonly _pos;
    private readonly _hex;
    private _owningPlayerSlot;
    private _system;
    private _planetClosest;
    private _planetExact;
    private _linkedPlastic;
    static getClosestPlastic(pos: Vector, plastics: Array<UnitPlastic>): UnitPlastic | undefined;
    /**
     * Convert a game object to a unit plastic entry (is it applies).
     *
     * @param obj
     * @returns
     */
    static getOne(obj: GameObject): UnitPlastic | undefined;
    /**
     * Find all unit plastics on the table (not in containers).
     * Does not assign token owners or planets, expecting the
     * caller to prune down to relevant entries and assign those.
     *
     * @returns
     */
    static getAll(): Array<UnitPlastic>;
    /**
     * Assign ownership of anonymous cardboard tokens to the closest
     * same-hex owned unit plastic.
     *
     * @param entries
     */
    static assignOwners(entries: Array<UnitPlastic>): void;
    /**
     * Assign planets to unit plastics, both closest and exact.
     *
     * @param entries
     */
    static assignPlanets(entries: Array<UnitPlastic>): void;
    constructor(unit: UnitType, count: number, obj: GameObject, pos: Vector);
    getCount(): number;
    getHex(): HexType;
    getLinkedPlastic(): UnitPlastic | undefined;
    getPos(): Vector;
    getObj(): GameObject;
    getOwningPlayerSlot(): number;
    getPlanetClosest(): Planet | undefined;
    getPlanetExact(): Planet | undefined;
    getSystem(): System | undefined;
    getUnit(): UnitType;
}
