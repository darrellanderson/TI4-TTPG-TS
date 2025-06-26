import { Card, SnapPoint } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
export declare class LayoutMats {
    private readonly _layout;
    constructor(playerSlot: number);
    getLayout(): LayoutObjects;
    _spawnTechDeck(snapPoint: SnapPoint | undefined): void;
    _filterTechDeck(deck: Card): void;
}
