import { GameObject } from "@tabletop-playground/api";
/**
 * Periodically show a laser beam between two game objects.
 *
 * Destroys iteslf when the source object is destroyed.
 */
export declare class AnimLaser {
    private readonly _src;
    private readonly _dst;
    private _lines;
    private readonly _onTick;
    constructor(src: GameObject, dst: GameObject);
}
