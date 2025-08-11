import { GameObject, Vector } from "@tabletop-playground/api";
import { Planet } from "../planet/planet";
import { SystemSchemaType } from "../schema/system-schema";
import { System } from "../system/system";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
/**
 * Keep system data, lookup by tile number or system tile object id.
 */
export declare class SystemRegistry {
    private readonly _systemTileNumberToSchemaAndSource;
    private readonly _systemTileObjIdToSystem;
    private readonly _onObjectCreatedHandler;
    private readonly _onObjectDestroyedHandler;
    _maybeRegister(obj: GameObject): void;
    constructor();
    destroy(): void;
    /**
     * Register new systems.
     *
     * @param systems
     * @returns
     */
    load(sourceAndPackageId: SourceAndPackageIdSchemaType, systemSchemaTypes: Array<SystemSchemaType>): this;
    /**
     * Load the game data (base plus codices and expansions).
     *
     * @returns
     */
    loadDefaultData(): this;
    /**
     * Get all registered system tile numbers.
     *
     * @returns
     */
    getAllSystemTileNumbers(): Array<number>;
    getAllDraftableSystemsFilteredByConfigSources(): Array<System>;
    /**
     * Get systems for system tile objects (optionally skip contained).
     *
     * @returns
     */
    getAllSystemsWithObjs(skipContained?: boolean): Array<System>;
    /**
     * Lookup system by position.
     *
     * @param pos
     * @returns
     */
    getByPosition(pos: Vector): System | undefined;
    getBySystemTileNumber(tileNumber: number): System | undefined;
    /**
     * Lookup system by system tile object nsid.
     * Duplicate tiles for the "same" system have separate System instances.
     *
     * @param objId
     * @returns
     */
    getBySystemTileObjId(objId: string): System | undefined;
    /**
     * Get planet by planet card nsid.
     *
     * @param nsid
     * @returns
     */
    getPlanetByPlanetCardNsid(nsid: string): Planet | undefined;
    /**
     * Get all planet card NSIDs, including from missing systems
     * (e.g. home systems might not exist in the system box).
     */
    rawAllPlanetCardNsids(): Array<string>;
    /**
     * Get the raw system schema associated with the tile number.
     *
     * @param tileNumber
     * @returns
     */
    rawBySystemTileNumber(tileNumber: number): SystemSchemaType | undefined;
    /**
     * Get the registered system's system tile object NSID.
     *
     * @param tileNumber
     * @returns
     */
    tileNumberToSystemTileObjNsid(tileNumber: number): string | undefined;
}
