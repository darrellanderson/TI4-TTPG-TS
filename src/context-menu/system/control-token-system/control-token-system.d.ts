import { GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class ControlTokenSystem implements IGlobal {
    private readonly _find;
    private readonly _actionName;
    private readonly _customActionHandler;
    init(): void;
    _maybeAddContextMenuItem(obj: GameObject): void;
    addControlToken(systemTileObj: GameObject, player: Player): boolean;
}
