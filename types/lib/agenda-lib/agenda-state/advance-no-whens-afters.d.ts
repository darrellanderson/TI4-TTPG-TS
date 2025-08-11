import { AgendaState } from "./agenda-state";
/**
 * Advance turn and/or phase when the current player has no whens or afters
 * during the appropriate phase.
 */
export declare class AdvanceNoWhensAfters {
    private readonly _agendaState;
    private _active;
    private readonly _onAgendaStateChangedHandler;
    constructor(agendaState: AgendaState);
    activate(force?: boolean): this;
    _isLastPlayerInTurnOrder(): boolean;
    _anyUncommitedWhens(): boolean;
    _isWhenPlayed(): boolean;
    _anyUncommitedAfters(): boolean;
    _isAfterPlayed(): boolean;
    _isSkipTurnWhen(): boolean;
    _isSkipTurnAfter(): boolean;
    _isSkipTurnVoting(): boolean;
    _resetWhens(): void;
    _resetAfters(): void;
    _maybeAdvancePhaseWhens(): boolean;
    _maybeAdvancePhaseAfters(): boolean;
    _maybeSkipTurnWhens(): boolean;
    _maybeSkipTurnAfters(): boolean;
    _maybeSkipTurnVoting(): boolean;
    maybeAdvance(): boolean;
}
