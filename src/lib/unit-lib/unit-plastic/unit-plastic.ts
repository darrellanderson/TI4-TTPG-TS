import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, HexType, NSID, ParsedNSID } from "ttpg-darrell";

import { UnitSchema, UnitType } from "../schema/unit-attrs-schema";
import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";

/**
 * Represents a single game object corresponding to a unit plastic.
 * It might be an anonymous (no owning player slot) cardboard token,
 * optionally assign those to the closest same-hex owned unit plastic.
 */
export class UnitPlastic {
  private static readonly __find: Find = new Find();

  private readonly _unit: UnitType;
  private readonly _count: number;
  private readonly _obj: GameObject;
  private readonly _pos: Vector;
  private readonly _hex: HexType;
  private _owningPlayerSlot: number;
  private _system: System | undefined;
  private _planetClosest: Planet | undefined;
  private _planetExact: Planet | undefined;

  /**
   * Convert a game object to a unit plastic entry (is it applies).
   *
   * @param obj
   * @returns
   */
  public static getOne(obj: GameObject): UnitPlastic | undefined {
    let unit: UnitType | undefined = undefined;
    let count: number = 1;

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
      let pos: Vector = obj.getPosition();

      const skipContained: boolean = true;
      const combatArena: GameObject | undefined = this.__find.findGameObject(
        "mat:base/combat-arena",
        undefined,
        skipContained
      );
      const system: System | undefined =
        OnSystemActivated.getLastActivatedSystem();

      if (combatArena && system) {
        const localPos: Vector = combatArena.worldPositionToLocal(pos);
        const extent: Vector = combatArena.getExtent(false, false);
        if (
          Math.abs(localPos.x) < extent.x &&
          Math.abs(localPos.y) < extent.y
        ) {
          const systemTileObj = system.getObj();
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
          const p0: Vector = entry._pos;
          for (const other of entries) {
            if (other._owningPlayerSlot >= 0) {
              const p1: Vector = other._pos;
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
        const pos: Vector = entry._pos;
        entry._system = system;
        entry._planetClosest = system.getPlanetClosest(pos);
        entry._planetExact = system.getPlanetExact(pos);
      }
    }
  }

  constructor(unit: UnitType, count: number, obj: GameObject, pos: Vector) {
    this._unit = unit;
    this._count = count;
    this._obj = obj;
    this._pos = pos;
    this._hex = TI4.hex.fromPosition(pos);
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

  getPos(): Vector {
    return this._pos;
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
