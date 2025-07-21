import { Vector } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
export declare class LayoutMapArea {
    private readonly _layout;
    constructor(numRings: number);
    getLayout(): LayoutObjects;
    _getCorners(ring: number, overrun: boolean): Array<Vector>;
    _addMapRingLines(numRings: number): void;
}
