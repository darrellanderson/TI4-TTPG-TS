import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { System } from "../system/system";
import { NSID } from "ttpg-darrell";
import { SOURCE_TO_SYSTEM_DATA } from "../data/system.data";

type SchemaAndSource = {
  schema: SystemSchemaType;
  source: string;
};

/**
 * Keep system data, lookup by tile number or system tile object id.
 */
export class SystemRegistry {
  private readonly _systemTileNumberToSchemaAndSource: Map<
    number,
    SchemaAndSource
  > = new Map();

  // Instantiate system objects for system tile objects.
  // Duplicates are an "error" but we cannot prevent them,
  // so create a separate system object for each.
  private readonly _systemTileObjIdToSystem: Map<string, System> = new Map();

  // TODO WORK IN PROGRESS

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const system: System | undefined = this.getBySystemTileNsid(nsid);
    if (system) {
      const oldObjId: string | undefined = system.getSystemTileObjId();
      if (oldObjId) {
        // TODO duplicate, what to do?
      }
      system.setSystemTileObjId(obj.getId());
    }
  };

  private readonly _onObjectDestroyedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const system: System | undefined = this.getBySystemTileNsid(nsid);
    if (system) {
      system.setSystemTileObjId(undefined);
    }
  };

  constructor() {
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    globalEvents.onObjectDestroyed.add(this._onObjectDestroyedHandler);
  }

  destroy() {
    globalEvents.onObjectCreated.remove(this._onObjectCreatedHandler);
    globalEvents.onObjectDestroyed.remove(this._onObjectDestroyedHandler);
  }

  /**
   * Register new systems.
   *
   * @param systems
   * @returns
   */
  public load(systemSchemas: Array<SystemSchemaType>, source: string): this {
    // Add systems.
    for (const systemSchema of systemSchemas) {
      // Create system (throws if invalid schema).
      const system: System = new System(systemSchema, source);
      const nsid: string = system.getSystemTileNsid();
      const tileNumber: number = system.getSystemTileNumber();

      // Duplicates are a data error, report to console and skip this system.
      if (this._systemTileNumberToSystem.has(tileNumber)) {
        throw new Error(`Duplicate system tile number: ${tileNumber}`);
      }

      // Register system.
      this._systemTileNsidToSystem.set(nsid, system);
      this._systemTileNumberToSystem.set(tileNumber, system);
    }

    // Link (or harmlessly re-link) system tile objects.
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const system: System | undefined = this.getBySystemTileNsid(nsid);
      if (system) {
        system.setSystemTileObjId(obj.getId());
      }
    }

    return this;
  }

  public loadDefaultData(): this {
    for (const [source, systemSchemas] of Object.entries(
      SOURCE_TO_SYSTEM_DATA
    )) {
      this.load(systemSchemas, source);
    }
    return this;
  }

  /**
   * Lookup system by system tile object nsid.
   *
   * @param nsid
   * @returns
   */
  public getBySystemTileNsid(nsid: string): System | undefined {
    return this._systemTileNsidToSystem.get(nsid);
  }

  /**
   * Lookup system by tile number.
   *
   * @param tile
   * @returns
   */
  public getBySystemTileNumber(tile: number): System | undefined {
    return this._systemTileNumberToSystem.get(tile);
  }
}
