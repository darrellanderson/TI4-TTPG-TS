import { GameObject, Vector } from "@tabletop-playground/api";
export declare class MapHomeSystemLocations {
    constructor();
    get(playerSlot: number): Vector | undefined;
    findExistingGenericHomeSystem(playerSlot: number): GameObject | undefined;
    spawnGenericHomeSystem(playerSlot: number): GameObject | undefined;
    findOrSpawnGenericHomeSystemOrThrow(playerSlot: number): GameObject;
}
