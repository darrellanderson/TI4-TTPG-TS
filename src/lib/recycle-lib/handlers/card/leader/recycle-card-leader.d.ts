import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
export declare class RecycleCardLeader extends GarbageHandler {
    private readonly _cardUtil;
    constructor();
    canRecycle(obj: GameObject): boolean;
    recycle(obj: GameObject): boolean;
}
