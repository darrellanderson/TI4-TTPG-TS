import { GameObject, Vector, Zone } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class OnObjectFellThroughTable implements IGlobal {
    private _relocateTo;
    readonly _onBeginOverlapHandler: (_zone: Zone, object: GameObject) => void;
    static _getTablePositionAndExtent(): {
        tablePosition: Vector;
        tableExtent: Vector;
    };
    static _findOrCreateZone(): Zone;
    /**
     * Destroy the zone (will be recreated on next load).
     * This can be useful for testing, or before doing bulk setup that may create
     * things at the origin (below the table).
     */
    static destroyZone(): void;
    init(): void;
    setRelocateTo(position: Vector): this;
}
