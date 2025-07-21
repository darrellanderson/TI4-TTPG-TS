import { GameObject } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { System } from "../lib/system-lib/system/system";
export declare class SliceBuildHelper {
    private readonly _obj;
    private readonly _text;
    private readonly _intervalHandle;
    constructor(obj: GameObject);
    update(): void;
    _getHexToSystem(): Map<HexType, System>;
    _getTransitiveAdjacentSystems(): Array<System>;
}
