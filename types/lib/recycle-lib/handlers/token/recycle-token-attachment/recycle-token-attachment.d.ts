import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
export declare class RecycleTokenAttachment extends GarbageHandler {
    private readonly _find;
    constructor();
    canRecycle(obj: GameObject): boolean;
    recycle(obj: GameObject): boolean;
}
