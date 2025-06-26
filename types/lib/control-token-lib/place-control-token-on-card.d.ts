import { Card, Vector } from "@tabletop-playground/api";
import { SpawnControlToken } from "./spawn-control-token";
/**
 * Use a deterministic layout following player seating.
 */
export declare class PlaceControlTokenOnCard {
    _spawnControlToken: SpawnControlToken;
    _computePos(center: Vector, playerSlot: number): Vector;
    place(card: Card, playerSlot: number): boolean;
}
