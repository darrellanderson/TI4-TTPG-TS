import { world } from "@tabletop-playground/api";
import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";

const AgendaRiderSchema = z.object({
  objId: z.string(),
  outcome: z.number(),
});
type AgendaRiderSchemaType = z.infer<typeof AgendaRiderSchema>;

const AgendaSeatStateSchema = z.object({
  avail: z.number().default(0),
  outcome: z.number().default(-1),
  votes: z.number().default(0),
  riders: z.array(AgendaRiderSchema).default([]),
});
type AgendaSeatStateSchemaType = z.infer<typeof AgendaSeatStateSchema>;

const AgendaStateSchema = z.object({
  agendaObjId: z.string().default(""),
  outcomeNames: z.array(z.string().nullable()).default([]),
  seatIndexToState: z.array(AgendaSeatStateSchema).default([]),
});
type AgendaStateSchemaType = z.infer<typeof AgendaStateSchema>;

export class AgendaState {
  public readonly onAgendaStateChanged: TriggerableMulticastDelegate<
    (agendaState: AgendaState) => void
  > = new TriggerableMulticastDelegate<(agendaState: AgendaState) => void>();

  private readonly _namespaceId: NamespaceId;
  private readonly _data: AgendaStateSchemaType;

  static isAgendaInProgress(namespaceId: NamespaceId): boolean {
    const data: string | undefined = world.getSavedData(namespaceId);
    return data !== undefined && data.length > 0;
  }

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;

    const data: string | undefined = world.getSavedData(namespaceId);
    if (data !== undefined && data.length > 0) {
      this._data = AgendaStateSchema.parse(JSON.parse(data));
    } else {
      this._data = AgendaStateSchema.parse({});
    }

    this._save();
  }

  destroy(): void {
    world.setSavedData("", this._namespaceId);
    this.onAgendaStateChanged.trigger(this);
    this.onAgendaStateChanged.clear();
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

  setAgendaObjId(agendaObjId: string): void {
    this._data.agendaObjId = agendaObjId;
    this._save();
    this.onAgendaStateChanged.trigger(this);
  }

  getOutcomeName(index: number): string | undefined {
    return this._data.outcomeNames[index] ?? undefined;
  }

  setOutcomeName(index: number, name: string): void {
    this._data.outcomeNames[index] = name;
    this._save();
    this.onAgendaStateChanged.trigger(this);
  }

  _getSeatState(seatIndex: number): AgendaSeatStateSchemaType {
    let seatState: AgendaSeatStateSchemaType | undefined =
      this._data.seatIndexToState[seatIndex];
    if (!seatState) {
      seatState = AgendaSeatStateSchema.parse({});
      this._data.seatIndexToState[seatIndex] = seatState;
    }
    return seatState;
  }

  getAvailableVotes(seatIndex: number): number {
    const seatState = this._getSeatState(seatIndex);
    return seatState.avail;
  }

  setAvailableVotes(seatIndex: number, votes: number): void {
    const seatState = this._getSeatState(seatIndex);
    seatState.avail = votes;
    this._save();
    this.onAgendaStateChanged.trigger(this);
  }

  getOutcomeChoice(seatIndex: number): number {
    const seatState = this._getSeatState(seatIndex);
    return seatState.outcome;
  }

  setOutcomeChoice(seatIndex: number, outcome: number): void {
    const seatState = this._getSeatState(seatIndex);
    seatState.outcome = outcome;
    this._save();
    this.onAgendaStateChanged.trigger(this);
  }

  getVotesForOutcome(seatIndex: number): number {
    const seatState = this._getSeatState(seatIndex);
    return seatState.votes;
  }

  setVotesForOutcome(seatIndex: number, votes: number): void {
    const seatState = this._getSeatState(seatIndex);
    seatState.votes = votes;
    this._save();
    this.onAgendaStateChanged.trigger(this);
  }

  addRider(seatIndex: number, objId: string, outcome: number): void {
    this.removeRider(objId);
    const seatState = this._getSeatState(seatIndex);
    seatState.riders.push({ objId, outcome });
    this._save();
    this.onAgendaStateChanged.trigger(this);
  }

  removeRider(objId: string): void {
    for (const seatState of this._data.seatIndexToState) {
      seatState.riders.forEach(
        (rider: AgendaRiderSchemaType, index: number) => {
          if (rider.objId === objId) {
            seatState.riders.splice(index, 1);
            this._save();
            this.onAgendaStateChanged.trigger(this);
          }
        }
      );
    }
  }
}
