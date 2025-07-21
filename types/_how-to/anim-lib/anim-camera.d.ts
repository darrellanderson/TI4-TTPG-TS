import { GameObject, Player, Rotator, Vector } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
export type AnimCameraParams = {
    player: Player;
    p0: Vector;
    p1: Vector;
    r0: Rotator;
    r1: Rotator;
    speed: number;
};
/**
 * Move the player camera.
 */
export declare class AnimCamera {
    readonly onDestroyed: TriggerableMulticastDelegate<() => void>;
    static readonly CAMERA_Z: number;
    /**
     * Look at the table-height dspPos from a slight southern position.
     *
     * @param dstPos
     * @returns
     */
    static simple(lookAt: Vector, z: number): Promise<void>;
    static simpleObj(obj: GameObject, z: number): Promise<void>;
    private readonly _params;
    private _cameraPos;
    private _tickCount;
    private readonly _onTick;
    constructor(params: AnimCameraParams);
    destroy(): void;
}
