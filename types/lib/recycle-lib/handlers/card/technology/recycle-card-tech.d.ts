import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
export declare class RecycleCardTech extends GarbageHandler {
    private readonly _find;
    constructor();
    canRecycle(obj: GameObject): boolean;
    recycle(card: GameObject): boolean;
}
