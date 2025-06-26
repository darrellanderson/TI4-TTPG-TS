import { GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class ActivateSystem implements IGlobal {
    private readonly _actionName;
    private readonly _customActionHandler;
    init(): void;
    _maybeAddContextMenuItem(obj: GameObject): void;
    moveCommandTokenToSystem(systemTileObj: GameObject, player: Player): boolean;
}
