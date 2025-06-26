import { Player, Vector, Zone } from "@tabletop-playground/api";
import { IGlobal, NamespaceId } from "ttpg-darrell";
export declare class HideMouseCursor implements IGlobal {
    private readonly _namespaceId;
    private readonly _hideCursorPlayerNames;
    private _zone;
    readonly _updateZoneHandler: () => void;
    constructor(namespaceId: NamespaceId);
    init(): void;
    addHideCursor(player: Player): void;
    hasHideCursor(player: Player): boolean;
    removeHideCursor(player: Player): void;
    private _updateZone;
    private _save;
    private _load;
    static _getTablePositionAndExtent(): {
        tablePosition: Vector;
        tableExtent: Vector;
    };
    static _findOrCreateZone(): Zone;
}
