import { PlayerSlot } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";
export type AgendaOutcomeSummary = {
    outcomeIndex: number;
    outcomeName: string;
    totalVotes: number;
    votingPlayerSlots: Array<PlayerSlot>;
};
export declare class ReportFinalAgendaState {
    private readonly _agendaState;
    static isComplete(agendaState: AgendaState): boolean;
    static getOutcomeIndexToTotalVotes(agendaState: AgendaState): Map<number, number>;
    static getOutcomeSummaries(agendaState: AgendaState): Array<AgendaOutcomeSummary>;
    static sortOutcomeIndicesByDecreasingVoteCount(agendaState: AgendaState): Array<number>;
    static summary(agendaState: AgendaState): string;
    constructor(agendaState: AgendaState);
}
