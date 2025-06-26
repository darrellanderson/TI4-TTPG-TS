import { GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { System } from "../../lib/system-lib/system/system";
export declare class OnSystemActivated implements IGlobal {
    private static __lastActivatedSystem;
    private static __lastActivatingPlayerSlot;
    private _lastActivatedTimestamp;
    private _image;
    private _ui;
    static getLastActivatedSystem(): System | undefined;
    static getLastActivatingPlayerSlot(): number | undefined;
    /**
     * Dropping a command token is ONE way to activate a system, not the only way.
     *
     * @param object
     * @param player
     * @param _thrown
     * @param _grabPosition
     * @param _grabRotation
     */
    private readonly _onReleasedHandler;
    readonly _onTickHandler: () => void;
    init(): void;
    _maybeLinkCommandToken(obj: GameObject): void;
    _rememberLastActivatedSystem(system: System, player: Player): void;
    _reportSystemActivation(system: System, player: Player): void;
    _displayActiveSystem(system: System, player: Player): void;
    _cancelAnimation(): void;
}
