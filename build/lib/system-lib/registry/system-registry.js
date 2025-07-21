"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemRegistry = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const system_schema_1 = require("../schema/system-schema");
const system_1 = require("../system/system");
const system_data_1 = require("../data/system.data");
const basic_types_schema_1 = require("../schema/basic-types-schema");
const system_tier_1 = require("../system/system-tier");
const packageId = api_1.refPackageId;
/**
 * Keep system data, lookup by tile number or system tile object id.
 */
class SystemRegistry {
    constructor() {
        this._systemTileNumberToSchemaAndSource = new Map();
        // Instantiate per relevant game object.  There "shoud not" be duplicates,
        // but that cannot be enforced.  If a copy exists, have a separate instance.
        this._systemTileObjIdToSystem = new Map();
        this._onObjectCreatedHandler = (obj) => {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const systemTileNumber = system_1.System.nsidToSystemTileNumber(nsid);
            if (systemTileNumber !== undefined) {
                const schemaAndSource = this._systemTileNumberToSchemaAndSource.get(systemTileNumber);
                if (schemaAndSource) {
                    // Register a fresh system object for this system tile object.
                    const system = new system_1.System(obj, schemaAndSource.sourceAndPackageId, schemaAndSource.schema);
                    this._systemTileObjIdToSystem.set(obj.getId(), system);
                }
            }
        };
        this._onObjectDestroyedHandler = (obj) => {
            const objId = obj.getId();
            if (this._systemTileObjIdToSystem.has(objId)) {
                this._systemTileObjIdToSystem.delete(objId);
            }
        };
        api_1.globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
        api_1.globalEvents.onObjectDestroyed.add(this._onObjectDestroyedHandler);
    }
    destroy() {
        api_1.globalEvents.onObjectCreated.remove(this._onObjectCreatedHandler);
        api_1.globalEvents.onObjectDestroyed.remove(this._onObjectDestroyedHandler);
    }
    /**
     * Register new systems.
     *
     * @param systems
     * @returns
     */
    load(sourceAndPackageId, systemSchemaTypes) {
        var _a;
        // Find all system tile objects.
        const tileToObjs = new Map();
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const systemTileNumber = system_1.System.nsidToSystemTileNumber(nsid);
            if (systemTileNumber !== undefined) {
                let objs = tileToObjs.get(systemTileNumber);
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
                system_schema_1.SystemSchema.parse(systemSchemaType);
                basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                const msg = `error: ${e.message}\nparsing: ${JSON.stringify(systemSchemaType)}`;
                throw new Error(msg);
            }
            // Tile numbers cannot be reused.
            const tileNumber = systemSchemaType.tile;
            if (this._systemTileNumberToSchemaAndSource.has(tileNumber)) {
                throw new Error(`Duplicate system tile number: ${tileNumber}`);
            }
            // Register system.
            this._systemTileNumberToSchemaAndSource.set(tileNumber, {
                sourceAndPackageId,
                schema: systemSchemaType,
            });
            // Instantiate for any existing system tile objects.
            const objs = (_a = tileToObjs.get(tileNumber)) !== null && _a !== void 0 ? _a : [];
            for (const obj of objs) {
                const system = new system_1.System(obj, sourceAndPackageId, systemSchemaType);
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
    loadDefaultData() {
        for (const [source, systemSchemas] of Object.entries(system_data_1.SOURCE_TO_SYSTEM_DATA)) {
            const sourceAndPackageId = {
                source,
                packageId,
            };
            this.load(sourceAndPackageId, systemSchemas);
        }
        return this;
    }
    /**
     * Get all registered system tile numbers.
     *
     * @returns
     */
    getAllSystemTileNumbers() {
        return Array.from(this._systemTileNumberToSchemaAndSource.keys()).filter((tileNumber) => tileNumber > 0);
    }
    getAllDraftableSystemsFilteredByConfigSources() {
        const sources = new Set(TI4.config.sources);
        const systemTier = new system_tier_1.SystemTier();
        return this.getAllSystemsWithObjs().filter((system) => {
            const source = system.getSource();
            if (!sources.has(source)) {
                return false;
            }
            const tier = systemTier.getTier(system);
            return tier !== "other";
        });
    }
    /**
     * Get systems for system tile objects (optionally skip contained).
     *
     * @returns
     */
    getAllSystemsWithObjs(skipContained = false) {
        return Array.from(this._systemTileObjIdToSystem.values()).filter((system) => {
            const obj = system.getObj();
            if (skipContained && obj.getContainer()) {
                return false;
            }
            return true;
        });
    }
    /**
     * Lookup system by position.
     *
     * @param pos
     * @returns
     */
    getByPosition(pos) {
        const z = api_1.world.getTableHeight(pos);
        const start = new api_1.Vector(pos.x, pos.y, z + 10);
        const end = new api_1.Vector(pos.x, pos.y, z - 10);
        const hits = api_1.world.lineTrace(start, end);
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
    getBySystemTileNumber(tileNumber) {
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
    getBySystemTileObjId(objId) {
        return this._systemTileObjIdToSystem.get(objId);
    }
    /**
     * Get planet by planet card nsid.
     *
     * @param nsid
     * @returns
     */
    getPlanetByPlanetCardNsid(nsid) {
        const systems = this.getAllSystemsWithObjs();
        for (const system of systems) {
            const planets = system.getPlanets();
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
    rawAllPlanetCardNsids() {
        const planetCardNsids = new Set();
        this._systemTileNumberToSchemaAndSource.forEach((schemaAndSource) => {
            const schema = schemaAndSource.schema;
            const source = schemaAndSource.sourceAndPackageId.source;
            if (schema.planets) {
                for (const planet of schema.planets) {
                    const planetCardNsid = `card.planet:${source}/${planet.nsidName}`;
                    planetCardNsids.add(planetCardNsid);
                }
            }
        });
        return Array.from(planetCardNsids);
    }
    /**
     * Get the raw system schema associated with the tile number.
     *
     * @param tileNumber
     * @returns
     */
    rawBySystemTileNumber(tileNumber) {
        const schemaAndSource = this._systemTileNumberToSchemaAndSource.get(tileNumber);
        return schemaAndSource === null || schemaAndSource === void 0 ? void 0 : schemaAndSource.schema;
    }
    /**
     * Get the registered system's system tile object NSID.
     *
     * @param tileNumber
     * @returns
     */
    tileNumberToSystemTileObjNsid(tileNumber) {
        const schemaAndSource = this._systemTileNumberToSchemaAndSource.get(tileNumber);
        if (schemaAndSource) {
            const source = schemaAndSource.sourceAndPackageId.source;
            return `tile.system:${source}/${tileNumber}`;
        }
        return undefined;
    }
}
exports.SystemRegistry = SystemRegistry;
//# sourceMappingURL=system-registry.js.map