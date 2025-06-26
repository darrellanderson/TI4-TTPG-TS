import { GameObject } from "@tabletop-playground/api";
/**
 * Lift and drop objects over a system tile.
 * Used to reserve space for system/planet attachments.
 */
export declare class SystemReserveSpace {
    private readonly _systemTileObj;
    private _liftedObjs;
    constructor(systemTileObj: GameObject);
    lift(): this;
    drop(): this;
}
