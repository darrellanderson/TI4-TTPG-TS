import {
  GameObject,
  TraceHit,
  Vector,
  globalEvents,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { Planet } from "../planet/planet";
import { SystemSchema, SystemSchemaType } from "../schema/system-schema";
import { System } from "../system/system";
import { SOURCE_TO_SYSTEM_DATA } from "../data/system.data";
import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import { SystemTier, SystemTierType } from "../system/system-tier";
import { cloneReplace } from "../../clone-replace/clone-replace";

const packageId: string = refPackageId;

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
    this._maybeRegister(obj);
  };

  private readonly _onObjectDestroyedHandler = (obj: GameObject): void => {
    const objId: string = obj.getId();
    if (this._systemTileObjIdToSystem.has(objId)) {
      this._systemTileObjIdToSystem.delete(objId);
    }
  };

  _maybeRegister(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    const systemTileNumber: number | undefined =
      System.nsidToSystemTileNumber(nsid);
    if (systemTileNumber !== undefined) {
      const schemaAndSource: SchemaAndSource | undefined =
        this._systemTileNumberToSchemaAndSource.get(systemTileNumber);
      const alreadyRegistered: boolean = this._systemTileObjIdToSystem.has(
        obj.getId()
      );
      if (schemaAndSource && !alreadyRegistered) {
        // Register a fresh system object for this system tile object.
        const system: System = new System(
          obj,
          schemaAndSource.sourceAndPackageId,
          schemaAndSource.schema
        );
        this._systemTileObjIdToSystem.set(obj.getId(), system);
      }
    }
  }

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
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

      // Face down planet count must match face up (planet position logic).
      if (
        systemSchemaType.planetsFaceDown &&
        systemSchemaType.planetsFaceDown.length !==
          systemSchemaType.planets?.length
      ) {
        throw new Error(
          `Face down planet count must match face up: ${tileNumber}`
        );
      }

      // Register system.
      this._systemTileNumberToSchemaAndSource.set(tileNumber, {
        sourceAndPackageId,
        schema: systemSchemaType,
      });

      // Instantiate for any existing system tile objects.
      const objs: Array<GameObject> = tileToObjs.get(tileNumber) ?? [];
      for (const obj of objs) {
        this._maybeRegister(obj);
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
      let sourceAndPackageId: SourceAndPackageIdSchemaType = {
        source,
        packageId,
      };

      // HACK: THUNDERS EDGE SHOULD POINT TO THE ADDITIVE PACKAGE.
      if (source === "thunders-edge") {
        sourceAndPackageId = {
          source,
          packageId: "645CE2B39EA24B33B131D2AFE863C05F",
        };
      }

      this.load(sourceAndPackageId, systemSchemas);
    }
    return this;
  }

  /**
   * Get all registered system tile numbers.
   *
   * @returns
   */
  public getAllSystemTileNumbers(): Array<number> {
    return Array.from(this._systemTileNumberToSchemaAndSource.keys()).filter(
      (tileNumber) => tileNumber > 0
    );
  }

  public getAllDraftableSystemsFilteredByConfigSources(): Array<System> {
    const sources: Set<string> = new Set(TI4.config.sources);
    const systemTier = new SystemTier();
    return this.getAllSystemsWithObjs().filter((system: System): boolean => {
      const source: string = system.getSource();
      if (!sources.has(source)) {
        return false;
      }
      const tier: SystemTierType = systemTier.getTier(system);
      return tier !== "other";
    });
  }

  /**
   * Get systems for system tile objects (optionally skip contained).
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

  public getBySystemTileNumber(tileNumber: number): System | undefined {
    for (const system of this._systemTileObjIdToSystem.values()) {
      if (system.getSystemTileNumber() === tileNumber) {
        return system;
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
   * Get planet by planet card nsid.
   *
   * @param nsid
   * @returns
   */
  public getPlanetByPlanetCardNsid(nsid: string): Planet | undefined {
    const systems: Array<System> = this.getAllSystemsWithObjs();
    for (const system of systems) {
      const planets: Array<Planet> = system.getPlanets();
      for (const planet of planets) {
        if (planet.getPlanetCardNsid() === nsid) {
          return planet;
        }
      }
    }
    return undefined;
  }

  /**
   * Get all planet card NSIDs, including from missing systems
   * (e.g. home systems might not exist in the system box).
   */
  public rawAllPlanetCardNsids(): Array<string> {
    const planetCardNsids: Set<string> = new Set();
    this._systemTileNumberToSchemaAndSource.forEach(
      (schemaAndSource: SchemaAndSource): void => {
        const schema: SystemSchemaType = schemaAndSource.schema;
        const source: string = schemaAndSource.sourceAndPackageId.source;
        if (schema.planets) {
          for (const planet of schema.planets) {
            const planetCardNsid: string = `card.planet:${source}/${planet.nsidName}`;
            planetCardNsids.add(planetCardNsid);
          }
        }
      }
    );
    return Array.from(planetCardNsids);
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

  getMecatolRexSystemTileNumber(): number {
    if (TI4.config.sources.includes("thunders-edge")) {
      return 112;
    } else {
      return 18;
    }
  }

  isMecatolRex(tileNumber: number): boolean {
    return tileNumber === 18 || tileNumber === 112;
  }

  /**
   * Given a system tile object, clone and replace it.
   *
   * The normal clone/replace *should* do this via the object delete/create
   * events, but it does not appear to be working reliably.
   *
   * @param obj
   */
  cloneReplace(obj: GameObject): void {
    const objId: string = obj.getId();
    const system: System | undefined = this._systemTileObjIdToSystem.get(objId);
    if (system) {
      const clone: GameObject = cloneReplace(obj);
      this._systemTileObjIdToSystem.delete(objId);
      this._maybeRegister(clone);
    }
  }
}
