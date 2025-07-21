import { GameObject, SnapPoint } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
export declare class LayoutStrategyCards {
    private readonly _layout;
    constructor();
    getLayout(): LayoutObjects;
    _placeStrategyCard(strategyCard: GameObject, snapPoint: SnapPoint | undefined): void;
}
