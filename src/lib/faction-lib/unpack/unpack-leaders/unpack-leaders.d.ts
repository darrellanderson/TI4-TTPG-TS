import { Card, GameObject, Rotator, SnapPoint } from "@tabletop-playground/api";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
export declare class UnpackLeaders extends AbstractUnpack {
    private readonly _cardUtil;
    private readonly _find;
    private readonly _removeByNsidOrSource;
    constructor(faction: Faction, playerSlot: number);
    unpack(): void;
    remove(): void;
    _findLeaderSheetOrThrow(): GameObject;
    _unpackLeaders(deck: Card, leaderNsids: Array<string>, snapPoint: SnapPoint, rotator: Rotator): void;
}
