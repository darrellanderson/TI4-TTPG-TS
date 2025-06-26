import { AgendaState } from "./agenda-state";
/**
 * Advance turn and/or phase when the current player has no whens or afters
 * during the appropriate phase.
 */
export declare class AdvanceNoWhensAfters {
    private readonly _agendaState;
    private readonly _onAgendaStateChangedHandler;
    constructor(agendaState: AgendaState);
    _isLastPlayerInTurnOrder(): boolean;
    _isWhenPlayed(): boolean;
    _isAfterPlayed(): boolean;
    _isSkipTurnWhen(): boolean;
    _isSkipTurnAfter(): boolean;
    _resetWhens(): void;
    _resetAfters(): void;
    _maybeAdvancePhaseWhens(): boolean;
    _maybeAdvancePhaseAfters(): boolean;
    _maybeSkipTurnWhens(): boolean;
    _maybeSkipTurnAfters(): boolean;
    maybeAdvance(): boolean;
}
