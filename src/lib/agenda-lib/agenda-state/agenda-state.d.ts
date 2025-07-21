import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";
export declare const MAX_OUTCOME_NAME_LENGTH = 20;
declare const AgendaPhase: z.ZodEnum<["whens", "afters", "voting"]>;
export type AgendaPhaseType = z.infer<typeof AgendaPhase>;
declare const AgendaRiderSchema: z.ZodObject<{
    seat: z.ZodNumber;
    objId: z.ZodString;
    outcome: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    seat: number;
    objId: string;
    outcome: number;
}, {
    seat: number;
    objId: string;
    outcome: number;
}>;
export type AgendaRiderSchemaType = z.infer<typeof AgendaRiderSchema>;
declare const AgendaSeatStateSchema: z.ZodObject<{
    avail: z.ZodDefault<z.ZodNumber>;
    outcome: z.ZodDefault<z.ZodNumber>;
    votes: z.ZodDefault<z.ZodNumber>;
    lockVotes: z.ZodDefault<z.ZodBoolean>;
    noWhens: z.ZodDefault<z.ZodNumber>;
    noAfters: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    outcome: number;
    avail: number;
    votes: number;
    lockVotes: boolean;
    noWhens: number;
    noAfters: number;
}, {
    avail?: number | undefined;
    outcome?: number | undefined;
    votes?: number | undefined;
    lockVotes?: boolean | undefined;
    noWhens?: number | undefined;
    noAfters?: number | undefined;
}>;
type AgendaSeatStateSchemaType = z.infer<typeof AgendaSeatStateSchema>;
export declare class AgendaState {
    readonly onAgendaStateChanged: TriggerableMulticastDelegate<(agendaState: AgendaState) => void>;
    private _suppressStateChangeEvents;
    private readonly _namespaceId;
    private readonly _data;
    private readonly _onTurnStateChangedHandler;
    private readonly _onAgendaCardRemovedHandler;
    static isAgendaInProgress(namespaceId: NamespaceId): boolean;
    constructor(namespaceId: NamespaceId);
    destroy(): void;
    transactThenTriggerDelayedStateChangedEvent(f: () => void): void;
    _save(): void;
    isActive(): boolean;
    getAgendaObjId(): string;
    setAgendaObjId(agendaObjId: string): this;
    getNumOutcomes(): number;
    getOutcomeName(index: number): string | undefined;
    setOutcomeName(index: number, name: string): this;
    getPhase(): AgendaPhaseType;
    setPhase(phase: AgendaPhaseType): this;
    _getSeatState(seatIndex: number): AgendaSeatStateSchemaType;
    getSeatAvailableVotes(seatIndex: number): number;
    setSeatAvailableVotes(seatIndex: number, votes: number): this;
    getSeatNoAfters(seatIndex: number): "unknown" | "no" | "never" | "play";
    setSeatNoAfters(seatIndex: number, noWhens: "unknown" | "no" | "never" | "play"): this;
    getSeatNoWhens(seatIndex: number): "unknown" | "no" | "never" | "play";
    setSeatNoWhens(seatIndex: number, noWhens: "unknown" | "no" | "never" | "play"): this;
    getSeatOutcomeChoice(seatIndex: number): number;
    setSeatOutcomeChoice(seatIndex: number, outcome: number): this;
    getSeatVotesForOutcome(seatIndex: number): number;
    setSeatVotesForOutcome(seatIndex: number, votes: number): this;
    getSeatVotesLocked(seatIndex: number): boolean;
    setSeatVotesLocked(seatIndex: number, locked: boolean): this;
    getRiders(): AgendaRiderSchemaType[];
    addRider(seatIndex: number, objId: string, outcome: number): this;
    removeRider(objId: string): this;
    getWaitingForMessage(): string;
}
export {};
