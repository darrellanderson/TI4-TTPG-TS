import { GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare const RIFT_ACTION_NAME: string;
export declare const RIFT_ACTION_TOOLTIP: string;
export declare class RightClickRift implements IGlobal {
    /**
     * Display the rift result as UI, goes away on object drop.
     *
     * @param unitObj
     * @param rollValue
     * @param surviveOn
     */
    static applyRiftResult(unitObj: GameObject, rollValue: number, surviveOn?: number): void;
    static getShipsInRift(riftObj: GameObject): Array<GameObject>;
    static isRiftSystemTile(obj: GameObject): boolean;
    static rollRift(riftObj: GameObject): void;
    init(): void;
    _onObjectCreatedHandler: (obj: GameObject) => void;
    _onCustomActionHandler: (obj: GameObject, _player: Player, identifier: string) => void;
}
