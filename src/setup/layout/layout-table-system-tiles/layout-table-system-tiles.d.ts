import { Rotator, Vector } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
export declare class LayoutTableSystemTiles {
    private readonly _layout;
    private readonly _find;
    constructor();
    getLayout(): LayoutObjects;
    _moveSystemTileFromContainer(tileNumber: number, pos: Vector, rot: Rotator): boolean;
}
