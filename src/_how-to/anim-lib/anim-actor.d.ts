import { Color, GameObject, Vector } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
export type AnimActorParams = {
    nsid: string;
    scale: number;
    color: Color;
    p0: Vector;
    p1: Vector;
    speed: number;
};
/**
 * Animate a game object.
 */
export declare class AnimActor {
    readonly onDestroyed: TriggerableMulticastDelegate<() => void>;
    private readonly _params;
    private readonly _obj;
    private readonly _onTick;
    constructor(params: AnimActorParams);
    destroy(): void;
    getObj(): GameObject;
}
