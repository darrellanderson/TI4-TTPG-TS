import { GameObject } from "@tabletop-playground/api";
export declare class SpawnControlToken {
    spawnControlToken(playerSlot: number): GameObject | undefined;
    spawnControlTokenOrThrow(playerSlot: number): GameObject;
}
