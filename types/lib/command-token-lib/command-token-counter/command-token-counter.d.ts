import { GameObject } from "@tabletop-playground/api";
export type CommandTokenCounts = {
    tactic: Array<GameObject>;
    fleet: Array<GameObject>;
    strategy: Array<GameObject>;
};
export declare class CommandTokenCounter {
    private static readonly ON_SHEET_DISTANCE_SQ;
    private _find;
    getPlayerSlotToCommandTokenCounts(): Map<number, CommandTokenCounts>;
}
