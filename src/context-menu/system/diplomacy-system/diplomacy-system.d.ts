import { GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class DiplomacySystem implements IGlobal {
    private readonly _actionName;
    private readonly _customActionHandler;
    init(): void;
    _maybeAddContextMenuItem(obj: GameObject): void;
    diplomacySystem(systemTileObj: GameObject, player: Player): boolean;
    _getExistingCommandTokenOwners(systemTileObj: GameObject): Set<number>;
}
