import {
  GameObject,
  TraceHit,
  Vector,
  globalEvents,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { SystemSchema, SystemSchemaType } from "../schema/system-schema";
import { System } from "../system/system";
import { SOURCE_TO_SYSTEM_DATA } from "../data/system.data";
import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import { ValidateImages } from "../validate/validate-images";

type SchemaAndSource = {
  schema: SystemSchemaType;
  sourceAndPackageId: SourceAndPackageIdSchemaType;
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
          obj,
          schemaAndSource.sourceAndPackageId,
          schemaAndSource.schema
        );
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
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    systemSchemaTypes: Array<SystemSchemaType>
  ): this {
    // Find all system tile objects.
    const tileToObjs: Map<number, Array<GameObject>> = new Map();
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const systemTileNumber: number | undefined =
        System.nsidToSystemTileNumber(nsid);
      if (systemTileNumber !== undefined) {
        let objs: Array<GameObject> | undefined =
          tileToObjs.get(systemTileNumber);
        if (!objs) {
          objs = [];
          tileToObjs.set(systemTileNumber, objs);
        }
        objs.push(obj);
      }
    }

    // Add systems.
    for (const systemSchemaType of systemSchemaTypes) {
      // Validate schema (oterhwise not validated until used).
      try {
        SystemSchema.parse(systemSchemaType);
        SourceAndPackageIdSchema.parse(sourceAndPackageId);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          systemSchemaType
        )}`;
        throw new Error(msg);
      }

      // Tile numbers cannot be reused.
      const tileNumber: number = systemSchemaType.tile;
      if (this._systemTileNumberToSchemaAndSource.has(tileNumber)) {
        throw new Error(`Duplicate system tile number: ${tileNumber}`);
      }

      // Register system.
      this._systemTileNumberToSchemaAndSource.set(tileNumber, {
        sourceAndPackageId,
        schema: systemSchemaType,
      });

      // Instantiate for any existing system tile objects.
      const objs: Array<GameObject> = tileToObjs.get(tileNumber) ?? [];
      for (const obj of objs) {
        const system = new System(obj, sourceAndPackageId, systemSchemaType);
        this._systemTileObjIdToSystem.set(obj.getId(), system);
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
      const sourceAndPackageId: SourceAndPackageIdSchemaType = {
        source,
        packageId: refPackageId,
      };
      this.load(sourceAndPackageId, systemSchemas);
    }
    return this;
  }

  /**
   * Get systems for system tile objects on the table (skip contained).
   *
   * @returns
   */
  getAllSystemsWithObjs(skipContained: boolean = false): Array<System> {
    return Array.from(this._systemTileObjIdToSystem.values()).filter(
      (system) => {
        const obj: GameObject = system.getObj();
        if (skipContained && obj.getContainer()) {
          return false;
        }
        return true;
      }
    );
  }

  /**
   * Lookup system by position.
   *
   * @param pos
   * @returns
   */
  getByPosition(pos: Vector): System | undefined {
    const z: number = world.getTableHeight(pos);
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
   * @param objId
   * @returns
   */
  public getBySystemTileObjId(objId: string): System | undefined {
    return this._systemTileObjIdToSystem.get(objId);
  }

  /**
   * Get the raw system schema associated with the tile number.
   *
   * @param tileNumber
   * @returns
   */
  public rawBySystemTileNumber(
    tileNumber: number
  ): SystemSchemaType | undefined {
    const schemaAndSource =
      this._systemTileNumberToSchemaAndSource.get(tileNumber);
    return schemaAndSource?.schema;
  }

  /**
   * Get the registered system's system tile object NSID.
   *
   * @param tileNumber
   * @returns
   */
  public tileNumberToSystemTileObjNsid(tileNumber: number): string | undefined {
    const schemaAndSource: SchemaAndSource | undefined =
      this._systemTileNumberToSchemaAndSource.get(tileNumber);
    if (schemaAndSource) {
      const source: string = schemaAndSource.sourceAndPackageId.source;
      return `tile.system:${source}/${tileNumber}`;
    }
    return undefined;
  }

  public validateImages(): this {
    const validateImages = new ValidateImages();
    for (const schemaAndSource of this._systemTileNumberToSchemaAndSource.values()) {
      const source: SourceAndPackageIdSchemaType =
        schemaAndSource.sourceAndPackageId;
      const schema: SystemSchemaType = schemaAndSource.schema;
      let img: string = System.schemaToImg(source, schema, false);
      validateImages.add(img, source.packageId);
      if (schema.imgFaceDown) {
        img = System.schemaToImg(source, schema, true);
        validateImages.add(img, source.packageId);
      }
    }
    validateImages.validateOrThrow();
    return this;
  }
}
