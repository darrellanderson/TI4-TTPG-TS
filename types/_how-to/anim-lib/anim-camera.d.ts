import { Player, Rotator, Vector } from "@tabletop-playground/api";
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
    /**
     * Look at the table-height dspPos from a slight southern position.
     *
     * @param dstPos
     * @returns
     */
    static simple(lookAt: Vector): Promise<void>;
    private readonly _params;
    private _cameraPos;
    private _tickCount;
    private readonly _onTick;
    constructor(params: AnimCameraParams);
    destroy(): void;
}
