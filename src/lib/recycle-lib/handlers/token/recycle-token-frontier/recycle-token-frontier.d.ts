import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
export declare class RecycleTokenFrontier extends GarbageHandler {
    canRecycle(obj: GameObject): boolean;
    recycle(obj: GameObject): boolean;
}
