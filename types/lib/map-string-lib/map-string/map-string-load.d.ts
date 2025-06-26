import { Rotator, Vector } from "@tabletop-playground/api";
import { MapStringEntry } from "./map-string-parser";
import { System } from "../../system-lib/system/system";
export declare class MapStringLoad {
    private readonly _find;
    _parseAndValidateMapString(mapString: string): Array<MapStringEntry> | undefined;
    _validateSystems(entries: Array<MapStringEntry>): boolean;
    /**
     * Get a snapshot of systems in game (on the table AND in containers).
     * Used to place systems with duplicates support.
     */
    _getTileNumberToSystemsSnapshot(): Map<number, Array<System>>;
    _tryMoveExistingSystemTileObj(systemTileNumber: number, pos: Vector, rot: Rotator, systemsSnapshot: Map<number, Array<System>>): boolean;
    _trySpawnNewSystemTileObj(systemTileNumber: number, pos: Vector, rot: Rotator): boolean;
    load(mapString: string): boolean;
    private _load;
}
