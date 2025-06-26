import { AgendaState } from "../agenda-state/agenda-state";
export declare const AGENDA_OUTCOME_TYPE_TO_LABEL: Record<string, string>;
export declare class AgendaOutcomes {
    /**
     * Do the populate as a transaction (rider processing gets batched).
     *
     * @param agendaState
     * @param outcomeType
     * @returns
     */
    populate(agendaState: AgendaState, outcomeType: string): boolean;
    _populate(agendaState: AgendaState, outcomeType: string): boolean;
    populateOrThrow(agendaState: AgendaState, outcomeType: string): void;
}
