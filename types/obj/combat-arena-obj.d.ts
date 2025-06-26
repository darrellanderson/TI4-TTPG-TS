import { GameObject } from "@tabletop-playground/api";
import { UnitPlastic } from "../lib/unit-lib/unit-plastic/unit-plastic";
export declare class CombatArenaObj {
    private readonly _obj;
    private readonly _img;
    private readonly _onSystemActivatedHandler;
    constructor(obj: GameObject);
    _addUI(): void;
    _setSystemImage(systemTileNumber: number): void;
    _getPlasticsInSystemOrArena(): Array<UnitPlastic>;
    warpIn(): void;
    warpOut(): void;
}
export declare function delayedCreateCombatArena(obj: GameObject, executionReason: string): void;
