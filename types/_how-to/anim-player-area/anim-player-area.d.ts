import { GameObject } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
export declare class AnimPlayerArea {
    private readonly _find;
    private readonly _playerSlot;
    constructor(playerSlot: PlayerSlot);
    _getObj(nsid: string): GameObject;
    _getTroves(): Array<GameObject>;
    fullTour(): Promise<void>;
    miniTour(): Promise<void>;
}
