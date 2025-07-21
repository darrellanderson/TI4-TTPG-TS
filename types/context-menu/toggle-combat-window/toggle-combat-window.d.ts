import { Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { System } from "../../lib/system-lib/system/system";
export declare const ACTION_TOGGLE_COMBAT: string;
export declare class ToggleCombatWindow implements IGlobal {
    private _window;
    readonly _onSystemActivatedHandler: (system: System, player: Player) => void;
    _isAttached(playerSlot: number): boolean;
    _createWindow(): void;
    /**
     * This window gets recreated whenever a system is activated.
     * Do not use the default toggle action, because it will move
     * to the end of the list on recreate.
     *
     * @param player
     * @param action
     */
    private readonly onCustomAction;
    init(): void;
    /**
     * Activating player, players with units in the system, and players
     * with PDS2 adjacent.
     *
     * @returns
     */
    _getRelevantPlayerSlots(system: System, player: Player): Array<number>;
    _hasAdjPds2(system: System, playerSlot: number): boolean;
    _getAdjPds2PlayerSlots(system: System): Array<number>;
}
