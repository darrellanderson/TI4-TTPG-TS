import { GameObject } from "@tabletop-playground/api";
import { NamespaceId, PlayerSlot, TriggerableMulticastDelegate } from "ttpg-darrell";
export type StrategyCardNumberAndState = {
    number: number;
    state: string;
};
/**
 * Per-player set of active strategy cards, in order of play.
 */
export declare class StrategyCardsState {
    readonly onStrategyCardsStateChanged: TriggerableMulticastDelegate<() => void>;
    private readonly onStrategyCardPlayedHandler;
    private readonly _persistenceKey;
    private readonly _playerSlotToActive;
    private readonly _strategyCardNumberToLastPlayerSlotPlayed;
    static strategyCardToNumber(strategyCard: GameObject): number | undefined;
    constructor(persistenceKey: NamespaceId);
    destroy(): void;
    _save(): void;
    _load(): void;
    _getMutableActive(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState>;
    active(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState>;
    addOrUpdate(playerSlot: number, strategyCardNumber: number, state: string): this;
    remove(playerSlot: number, strategyCardNumber: number): this;
    setLastPlayerSlotPlayed(strategyCardNumber: number, playerSlot: PlayerSlot): this;
    getLastPlayerSlotPlayed(strategyCardNumber: number): PlayerSlot | undefined;
}
