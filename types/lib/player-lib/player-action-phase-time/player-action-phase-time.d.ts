import { IGlobal, NamespaceId } from "ttpg-darrell";
export declare class PlayerActionPhaseTime implements IGlobal {
    private readonly _namespaceId;
    private readonly _roundToSeatIndexToSeconds;
    private _intervalHandle;
    private _isActionPhase;
    private _round;
    constructor(namespaceId: NamespaceId | undefined);
    _save(): void;
    _load(): Array<Array<number>>;
    private readonly _onGameData;
    readonly _onInterval: () => void;
    _getSeatIndexToSeconds(round: number): Array<number>;
    _incrSeconds(round: number, seatIndex: number, incrBy: number): void;
    getSeconds(round: number, seatIndex: number): number;
    init(): void;
    _maybeStartInterval(executionReason: string): void;
    destroy(): void;
    getRound(): number;
    isActiveActionPhase(): boolean;
}
