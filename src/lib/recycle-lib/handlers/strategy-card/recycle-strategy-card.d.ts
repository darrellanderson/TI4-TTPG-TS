import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
export declare class RecycleStrategyCard extends GarbageHandler {
    private readonly _find;
    canRecycle(obj: GameObject): boolean;
    recycle(obj: GameObject): boolean;
}
