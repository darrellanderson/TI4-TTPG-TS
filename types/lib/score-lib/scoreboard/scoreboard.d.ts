import { GameObject, Rotator, Vector } from "@tabletop-playground/api";
export declare class Scoreboard {
    private readonly _find;
    applyGamePoints(gamePoints: number): this;
    _getLocalCenter(score: number): Vector | undefined;
    /**
     * Get all control tokens on the scoreboard (normally just one).
     *
     * @returns
     */
    _getPlayerSlotToAtopControlTokens(): Map<number, Array<GameObject>>;
    /**
     * Get player slot to leading control token on the scoreboard (highest score).
     *
     * @returns
     */
    getPlayerSlotToLeadControlToken(): Map<number, GameObject>;
    getLeadControlToken(playerSlot: number): GameObject | undefined;
    getPlayerSlotToScore(): Map<number, number>;
    getControlTokenRotation(): Rotator | undefined;
    getScoreboard(): GameObject | undefined;
    posToScore(pos: Vector): number | undefined;
    scoreToPos(score: number, playerSlot: number): Vector | undefined;
}
