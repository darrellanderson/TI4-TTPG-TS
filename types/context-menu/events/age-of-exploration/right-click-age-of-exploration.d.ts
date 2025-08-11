import { Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";
import { System } from "../../../lib/system-lib/system/system";
export declare const AGE_OF_EXPLORATION_ACTION_NAME: string;
/**
 * ACTION: ... roll 1 die, on a result of 1-4 draw a random unused red tile,
 * on a result of 5-10 draw a random unused blue tile; place that tile
 * adjacent to any border system that contains your ships.  Place a frontier
 * token in the newly placed system if it does not contain any planets.
 */
export declare class RightClickAgeOfExploration extends AbstractRightClickCard {
    constructor();
    _getAvailableLegalSystems(): Array<System>;
    _getAvailableRedSystems(): Array<System>;
    _getAvailableBlueSystems(): Array<System>;
    _getAvailableSystem(tileColor: "red" | "blue"): System | undefined;
    _dealSystemTile(pos: Vector, tileColor: "red" | "blue"): void;
    _chooseTileColor(): "red" | "blue";
    _colorFromRoll(roll: number): "red" | "blue";
}
