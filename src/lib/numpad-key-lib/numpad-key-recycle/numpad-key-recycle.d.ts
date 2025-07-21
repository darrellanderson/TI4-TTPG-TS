import { Player } from "@tabletop-playground/api";
export declare class NumpadKeyRecycle {
    private readonly _playerNameToCtrlKeyCount;
    private readonly _key;
    private readonly _onScriptButtonPressed;
    constructor(key: number);
    destroy(): void;
    _getCtrlKeyCount(player: Player): number;
}
