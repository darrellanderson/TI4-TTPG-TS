import { GameObject } from "@tabletop-playground/api";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
export declare class UnpackHomeSystem extends AbstractUnpack {
    private readonly _find;
    constructor(faction: Faction, playerSlot: number);
    _findGenericHomeSystemTileOrThrow(): GameObject;
    _findFactionSheetOrThrow(): GameObject;
    _spawnGenericHomeSystemTileOrThrow(): GameObject;
    _getHomeSystemTileNsid(): string;
    _spawnHomeSystemTile(): GameObject;
    _findHomeSystemTileOrThrow(): GameObject;
    _getSurrogateSystemTileNsid(): string | undefined;
    _spawnSurrogateSystemTile(): GameObject | undefined;
    _findSurrogateSystemTile(): GameObject | undefined;
    unpack(): void;
    remove(): void;
}
