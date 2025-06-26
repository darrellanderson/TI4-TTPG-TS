import { Player } from "@tabletop-playground/api";
/**
 * Use a consistent player name.
 */
export declare class PlayerName {
    getByPlayer(player: Player): string;
    getBySlot(playerSlot: number): string;
}
