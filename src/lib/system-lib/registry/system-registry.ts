import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { System } from "../system/system";
import { NSID, ParsedNSID } from "ttpg-darrell";

export class SystemRegistry {
  private readonly _tileNumberToSystem: Map<number, System> = new Map();

  public static _getTileNumberFromObj(obj: GameObject): number | undefined {
    const nsid: string = NSID.get(obj);
    if (!nsid.startsWith("tile.system")) {
      return undefined; // not a system tile
    }
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (!parsed) {
      return undefined; // not a valid NSID
    }
    const tileNumber: number = Number.parseInt(parsed.nameParts[0]);
    if (Number.isNaN(tileNumber)) {
      return undefined; // not a valid tile number
    }
    return tileNumber;
  }

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const tileNumber: number | undefined =
      SystemRegistry._getTileNumberFromObj(obj);
    if (tileNumber === undefined) {
      return;
    }
    const system: System | undefined = this.getByTileNumber(tileNumber);
    if (!system) {
      return;
    }
    const tileObjId: string = obj.getId();
    system.setSystemTileObjId(tileObjId);
  };

  private readonly _onObjectDestroyedHandler = (obj: GameObject): void => {
    const tileNumber: number | undefined =
      SystemRegistry._getTileNumberFromObj(obj);
    if (tileNumber === undefined) {
      return;
    }
    const system: System | undefined = this.getByTileNumber(tileNumber);
    if (!system) {
      return;
    }
    system.setSystemTileObjId(undefined);
  };

  constructor() {
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    globalEvents.onObjectDestroyed.add(this._onObjectDestroyedHandler);
  }

  destroy() {
    globalEvents.onObjectCreated.remove(this._onObjectCreatedHandler);
    globalEvents.onObjectDestroyed.remove(this._onObjectDestroyedHandler);
  }

  public load(systems: Array<SystemSchemaType>): this {
    const tileNumberToTileObjId: Map<number, string> = new Map();
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const tileNumber: number | undefined =
        SystemRegistry._getTileNumberFromObj(obj);
      if (tileNumber !== undefined) {
        tileNumberToTileObjId.set(tileNumber, obj.getId());
      }
    }

    for (const systemSchema of systems) {
      // Create system.
      const system: System = new System(systemSchema);
      const tileNumber: number = system.getTileNumber();

      // Link system tile game object.
      const tileObjId: string | undefined =
        tileNumberToTileObjId.get(tileNumber);
      if (tileObjId) {
        system.setSystemTileObjId(tileObjId);
      }

      // Register system.
      this._tileNumberToSystem.set(tileNumber, system);
    }

    return this;
  }

  public getByTileNumber(tile: number): System | undefined {
    return this._tileNumberToSystem.get(tile);
  }

  public getByTileObjId(tileObjId: string): System | undefined {
    const tileObj: GameObject | undefined = world.getObjectById(tileObjId);
    if (!tileObj || !tileObj.isValid()) {
      return undefined;
    }
    const tileNumber: number | undefined =
      SystemRegistry._getTileNumberFromObj(tileObj);
    if (tileNumber === undefined) {
      return undefined;
    }
    return this._tileNumberToSystem.get(tileNumber);
  }
}
