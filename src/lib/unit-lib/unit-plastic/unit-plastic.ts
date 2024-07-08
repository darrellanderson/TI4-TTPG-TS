import { GameObject, Vector, world } from "@tabletop-playground/api";
import { HexType, NSID, ParsedNSID } from "ttpg-darrell";

import { UnitSchema, UnitType } from "../schema/unit-attrs-schema";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";

/**
 * Represents a single game object corresponding to a unit plastic.
 * It might be an anonymous (no owning player slot) cardboard token,
 * optionally assign those to the closest same-hex owned unit plastic.
 */
export class UnitPlastic {
  private readonly _unit: UnitType;
  private readonly _count: number;
  private readonly _obj: GameObject;
  private readonly _hex: HexType;
  private _owningPlayerSlot: number;
  private _system: System | undefined;
  private _planetClosest: Planet | undefined;
  private _planetExact: Planet | undefined;

  /**
   * Convenience method to count the number of each unit type.
   * Does not filter by owner/hex/etc, caller should handle that first.
   *
   * @param unitPlastics
   * @returns
   */
  public static count(unitPlastics: Array<UnitPlastic>): Map<UnitType, number> {
    const result: Map<UnitType, number> = new Map();
    for (const unitPlastic of unitPlastics) {
      const unit: UnitType = unitPlastic.getUnit();
      const count: number = unitPlastic.getCount();
      const existing: number = result.get(unit) ?? 0;
      result.set(unit, existing + count);
    }
    return result;
  }

  /**
   * Convert a game object to a unit plastic entry (is it applies).
   *
   * @param obj
   * @returns
   */
  public static getOne(obj: GameObject): UnitPlastic | undefined {
    let unit: UnitType | undefined = undefined;
    let count: number = 1;
    let owningPlayerSlot: number = obj.getOwningPlayerSlot(); // -1 for tokens

    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("unit:")) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      const maybeUnit: string | undefined = parsed?.nameParts[0];
      if (UnitSchema.safeParse(maybeUnit).success) {
        unit = maybeUnit as UnitType;
      }
    } else if (nsid.startsWith("token:base/")) {
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
    } else if (nsid.startsWith("token.control:")) {
      unit = "control-token";
    }

    if (unit) {
      return new UnitPlastic(unit, count, obj);
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
  public static getAll(): Array<UnitPlastic> {
    const result: Array<UnitPlastic> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const maybeEntry: UnitPlastic | undefined = this.getOne(obj);
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
  public static assignOwners(entries: Array<UnitPlastic>): void {
    const hexToEntries: Map<HexType, Array<UnitPlastic>> = new Map();
    for (const entry of entries) {
      const hex: HexType = entry._hex;
      let entries: Array<UnitPlastic> | undefined = hexToEntries.get(hex);
      if (!entries) {
        entries = [];
        hexToEntries.set(hex, entries);
      }
      entries.push(entry);
    }
    for (const entries of hexToEntries.values()) {
      for (const entry of entries) {
        if (entry._owningPlayerSlot < 0) {
          let bestPlayerSlot: number = -1;
          let bestDSq: number = Number.MAX_VALUE;
          const p0: Vector = entry._obj.getPosition();
          for (const other of entries) {
            if (other._owningPlayerSlot >= 0) {
              const p1: Vector = other._obj.getPosition();
              const dSq: number = p0.subtract(p1).magnitudeSquared();
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
  public static assignPlanets(entries: Array<UnitPlastic>): void {
    const systems: Array<System> = TI4.systemRegistry.getAllSystemsWithObjs();
    const hexToSystem: Map<HexType, System> = new Map();
    for (const system of systems) {
      const hex: HexType = TI4.hex.fromPosition(system.getObj().getPosition());
      hexToSystem.set(hex, system);
    }
    for (const entry of entries) {
      const system: System | undefined = hexToSystem.get(entry._hex);
      if (system) {
        const pos: Vector = entry._obj.getPosition();
        entry._system = system;
        entry._planetClosest = system.getPlanetClosest(pos);
        entry._planetExact = system.getPlanetExact(pos);
      }
    }
  }

  constructor(unit: UnitType, count: number, obj: GameObject) {
    this._unit = unit;
    this._count = count;
    this._obj = obj;
    this._hex = TI4.hex.fromPosition(obj.getPosition());
    this._owningPlayerSlot = obj.getOwningPlayerSlot();
    this._planetClosest = undefined;
    this._planetExact = undefined;
  }

  getCount(): number {
    return this._count;
  }

  getHex(): HexType {
    return this._hex;
  }

  getObj(): GameObject {
    return this._obj;
  }

  getOwningPlayerSlot(): number {
    return this._owningPlayerSlot;
  }

  getPlanetClosest(): Planet | undefined {
    return this._planetClosest;
  }

  getPlanetExact(): Planet | undefined {
    return this._planetExact;
  }

  getSystem(): System | undefined {
    return this._system;
  }

  getUnit(): UnitType {
    return this._unit;
  }
}
