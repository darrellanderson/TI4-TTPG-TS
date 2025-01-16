import { world } from "@tabletop-playground/api";
import {
  NamespaceId,
  TriggerableMulticastDelegate,
  TurnOrder,
} from "ttpg-darrell";
import { number, z } from "zod";
import { AdvanceNoWhensAfters } from "./advance-no-whens-afters";
import { ReportFinalAgendaState } from "./report-final-agenda-state";

export const MAX_OUTCOME_NAME_LENGTH = 20;

const AgendaPhase = z.enum(["whens", "afters", "voting"]);
export type AgendaPhaseType = z.infer<typeof AgendaPhase>;

const AgendaRiderSchema = z.object({
  seat: z.number(),
  objId: z.string(),
  outcome: z.number(),
});
export type AgendaRiderSchemaType = z.infer<typeof AgendaRiderSchema>;

const AgendaSeatStateSchema = z.object({
  avail: z.number().default(0),
  outcome: z.number().default(-1),
  votes: z.number().default(0),
  lockVotes: z.boolean().default(false),
  noWhens: number().default(0), // 0 = unknown, 1 = no, 2 = never
  noAfters: number().default(0), // 0 = unknown, 1 = no, 2 = never
});
type AgendaSeatStateSchemaType = z.infer<typeof AgendaSeatStateSchema>;

const AgendaStateSchema = z.object({
  agendaObjId: z.string().default(""),
  outcomeNames: z.array(z.string().nullable()).default([]),
  phase: AgendaPhase.default("whens"),
  riders: z.array(AgendaRiderSchema).default([]),
  seatIndexToState: z.array(AgendaSeatStateSchema.nullable()).default([]),
});
type AgendaStateSchemaType = z.infer<typeof AgendaStateSchema>;

export class AgendaState {
  public readonly onAgendaStateChanged: TriggerableMulticastDelegate<
    (agendaState: AgendaState) => void
  > = new TriggerableMulticastDelegate<(agendaState: AgendaState) => void>();

  private readonly _namespaceId: NamespaceId;
  private readonly _data: AgendaStateSchemaType;

  private readonly _onTurnStateChangedHandler = () => {
    this.onAgendaStateChanged.trigger(this);
  };

  static isAgendaInProgress(namespaceId: NamespaceId): boolean {
    const data: string | undefined = world.getSavedData(namespaceId);
    return data !== undefined && data.length > 0;
  }

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;

    TurnOrder.onTurnStateChanged.add(this._onTurnStateChangedHandler);

    const data: string | undefined = world.getSavedData(namespaceId);
    if (data !== undefined && data.length > 0) {
      this._data = AgendaStateSchema.parse(JSON.parse(data));
    } else {
      this._data = AgendaStateSchema.parse({});
    }

    this._save();

    // Advance turn/phase current "waiting for" player sets no whens or afters.
    new AdvanceNoWhensAfters(this);

    // Report final state when finished.
    new ReportFinalAgendaState(this);
  }

  destroy(): void {
    world.setSavedData("", this._namespaceId);
    this.onAgendaStateChanged.trigger(this);
    this.onAgendaStateChanged.clear();
    TurnOrder.onTurnStateChanged.remove(this._onTurnStateChangedHandler);
  }

  _save(): void {
    const json: string = JSON.stringify(this._data);
    if (json.length < 1024) {
      world.setSavedData(json, this._namespaceId);
    }
  }

  isActive(): boolean {
    return AgendaState.isAgendaInProgress(this._namespaceId);
  }

  getAgendaObjId(): string {
    return this._data.agendaObjId;
  }

  setAgendaObjId(agendaObjId: string): this {
    this._data.agendaObjId = agendaObjId;
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getNumOutcomes(): number {
    return this._data.outcomeNames.length;
  }

  getOutcomeName(index: number): string | undefined {
    return this._data.outcomeNames[index] ?? undefined;
  }

  setOutcomeName(index: number, name: string): this {
    if (name.length > MAX_OUTCOME_NAME_LENGTH) {
      name = name.substring(0, MAX_OUTCOME_NAME_LENGTH - 3) + "...";
    }
    this._data.outcomeNames[index] = name;
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getPhase(): AgendaPhaseType {
    return this._data.phase;
  }

  setPhase(phase: AgendaPhaseType): this {
    this._data.phase = phase;
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  _getSeatState(seatIndex: number): AgendaSeatStateSchemaType {
    let seatState: AgendaSeatStateSchemaType | null | undefined =
      this._data.seatIndexToState[seatIndex];
    if (!seatState) {
      seatState = AgendaSeatStateSchema.parse({});
      this._data.seatIndexToState[seatIndex] = seatState;
    }
    return seatState;
  }

  getSeatAvailableVotes(seatIndex: number): number {
    const seatState = this._getSeatState(seatIndex);
    return seatState.avail;
  }

  setSeatAvailableVotes(seatIndex: number, votes: number): this {
    const seatState = this._getSeatState(seatIndex);
    seatState.avail = votes;
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getSeatNoAfters(seatIndex: number): "unknown" | "no" | "never" {
    const seatState = this._getSeatState(seatIndex);
    if (seatState.noAfters === 1) {
      return "no";
    } else if (seatState.noAfters === 2) {
      return "never";
    } else {
      return "unknown";
    }
  }

  setSeatNoAfters(
    seatIndex: number,
    noWhens: "unknown" | "no" | "never"
  ): this {
    const seatState = this._getSeatState(seatIndex);
    if (noWhens === "no") {
      seatState.noAfters = 1;
    } else if (noWhens === "never") {
      seatState.noAfters = 2;
    } else {
      seatState.noAfters = 0;
    }
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getSeatNoWhens(seatIndex: number): "unknown" | "no" | "never" {
    const seatState = this._getSeatState(seatIndex);
    if (seatState.noWhens === 1) {
      return "no";
    } else if (seatState.noWhens === 2) {
      return "never";
    } else {
      return "unknown";
    }
  }

  setSeatNoWhens(seatIndex: number, noWhens: "unknown" | "no" | "never"): this {
    const seatState = this._getSeatState(seatIndex);
    if (noWhens === "no") {
      seatState.noWhens = 1;
    } else if (noWhens === "never") {
      seatState.noWhens = 2;
    } else {
      seatState.noWhens = 0;
    }
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getSeatOutcomeChoice(seatIndex: number): number {
    const seatState = this._getSeatState(seatIndex);
    return seatState.outcome;
  }

  setSeatOutcomeChoice(seatIndex: number, outcome: number): this {
    const seatState = this._getSeatState(seatIndex);
    seatState.outcome = outcome;
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getSeatVotesForOutcome(seatIndex: number): number {
    const seatState = this._getSeatState(seatIndex);
    return seatState.votes;
  }

  setSeatVotesForOutcome(seatIndex: number, votes: number): this {
    const seatState = this._getSeatState(seatIndex);
    seatState.votes = votes;
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getSeatVotesLocked(seatIndex: number): boolean {
    const seatState = this._getSeatState(seatIndex);
    return seatState.lockVotes;
  }

  setSeatsVotesLocked(seatIndex: number, locked: boolean) {
    const seatState = this._getSeatState(seatIndex);
    seatState.lockVotes = locked;
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  getRiders(): AgendaRiderSchemaType[] {
    return this._data.riders;
  }

  addRider(seatIndex: number, objId: string, outcome: number): this {
    this.removeRider(objId);
    this._data.riders.push({ seat: seatIndex, objId, outcome });
    this._save();
    this.onAgendaStateChanged.trigger(this);
    return this;
  }

  removeRider(objId: string): this {
    const index: number = this._data.riders.findIndex(
      (rider) => rider.objId === objId
    );
    if (index >= 0) {
      this._data.riders.splice(index, 1);
      this._save();
      this.onAgendaStateChanged.trigger(this);
    }
    return this;
  }

  getWaitingForMessage(): string {
    const currentPlayerSlot: number = TI4.turnOrder.getCurrentTurn();
    const currentPlayerName: string =
      TI4.playerName.getBySlot(currentPlayerSlot);

    const phase: string = this.getPhase();
    let action: string = "";
    let suffix: string = "";
    if (this.getPhase() === "whens") {
      action = "Any whens";
      suffix = "?";
    } else if (phase === "afters") {
      action = "Any afters";
      suffix = "?";
    } else if (phase === "voting") {
      action = "Please vote";
    }

    return `${action}, ${currentPlayerName}${suffix}`;
  }
}
