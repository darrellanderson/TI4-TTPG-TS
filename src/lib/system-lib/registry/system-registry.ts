import {
  GameObject,
  TraceHit,
  Vector,
  globalEvents,
  world,
} from "@tabletop-playground/api";
import { SystemSchema, SystemSchemaType } from "../schema/system-schema";
import { System } from "../system/system";
import { NSID } from "ttpg-darrell";
import { SOURCE_TO_SYSTEM_DATA } from "../data/system.data";
import { NsidNameSchema } from "../schema/basic-types-schema";

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

  // Instantiate per relevant game object.  There "shoud not" be duplicates,
  // but that cannot be enforced.  If a copy exists, have a separate instance.
  private readonly _systemTileObjIdToSystem: Map<string, System> = new Map();

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const systemTileNumber: number | undefined =
      System.nsidToSystemTileNumber(nsid);
    if (systemTileNumber !== undefined) {
      const schemaAndSource: SchemaAndSource | undefined =
        this._systemTileNumberToSchemaAndSource.get(systemTileNumber);
      if (schemaAndSource) {
        // Register a fresh system object for this system tile object.
        const system: System = new System(
          schemaAndSource.schema,
          schemaAndSource.source
        );
        system.setSystemTileObjId(obj.getId());
        this._systemTileObjIdToSystem.set(obj.getId(), system);
      }
    }
  };

  private readonly _onObjectDestroyedHandler = (obj: GameObject): void => {
    const objId: string = obj.getId();
    if (this._systemTileObjIdToSystem.has(objId)) {
      this._systemTileObjIdToSystem.delete(objId);
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
  public load(
    systemSchemaTypes: Array<SystemSchemaType>,
    source: string
  ): this {
    // Add systems.
    for (const systemSchemaType of systemSchemaTypes) {
      // Validate schema (oterhwise not validated until used).
      try {
        SystemSchema.parse(systemSchemaType);
        NsidNameSchema.parse(source);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          systemSchemaType
        )}`;
        throw new Error(msg);
      }

      // Duplicates not allowed.
      const tileNumber: number = systemSchemaType.tile;
      if (this._systemTileNumberToSchemaAndSource.has(tileNumber)) {
        throw new Error(`Duplicate system tile number: ${tileNumber}`);
      }

      // Register system.
      this._systemTileNumberToSchemaAndSource.set(tileNumber, {
        schema: systemSchemaType,
        source,
      });
    }

    // Link (or harmlessly re-link) system tile objects.
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const systemTileNumber: number | undefined =
        System.nsidToSystemTileNumber(nsid);
      if (systemTileNumber !== undefined) {
        const schemaAndSource: SchemaAndSource | undefined =
          this._systemTileNumberToSchemaAndSource.get(systemTileNumber);
        if (schemaAndSource) {
          const system = new System(
            schemaAndSource.schema,
            schemaAndSource.source
          );
          system.setSystemTileObjId(obj.getId());
          this._systemTileObjIdToSystem.set(obj.getId(), system);
        }
      }
    }

    return this;
  }

  /**
   * Load the game data (base plus codices and expansions).
   *
   * @returns
   */
  public loadDefaultData(): this {
    for (const [source, systemSchemas] of Object.entries(
      SOURCE_TO_SYSTEM_DATA
    )) {
      this.load(systemSchemas, source);
    }
    return this;
  }

  /**
   * Lookup system by position.
   *
   * @param pos
   * @returns
   */
  getByPosition(pos: Vector): System | undefined {
    const z = world.getTableHeight(pos);
    const start = new Vector(pos.x, pos.y, z + 10);
    const end = new Vector(pos.x, pos.y, z - 10);
    const hits: Array<TraceHit> = world.lineTrace(start, end);
    for (const hit of hits) {
      if (hit.object.isValid()) {
        const objId = hit.object.getId();
        const system = this.getBySystemTileObjId(objId);
        if (system) {
          return system;
        }
      }
    }

    return undefined;
  }

  /**
   * Lookup system by system tile object nsid.
   * Duplicate tiles for the "same" system have separate System instances.
   *
   * @param nsid
   * @returns
   */
  public getBySystemTileObjId(nsid: string): System | undefined {
    return this._systemTileObjIdToSystem.get(nsid);
  }

  /**
   * Lookup system by tile number.
   *
   * @param tile
   * @returns
   */
  public rawBySystemTileNumber(tile: number): System | undefined {
    const schemaAndSource: SchemaAndSource | undefined =
      this._systemTileNumberToSchemaAndSource.get(tile);
    if (schemaAndSource) {
      return new System(schemaAndSource.schema, schemaAndSource.source);
    }
    return undefined;
  }
}
