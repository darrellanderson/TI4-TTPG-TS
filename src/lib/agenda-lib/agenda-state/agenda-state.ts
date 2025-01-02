import { world } from "@tabletop-playground/api";
import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";

export const AgendaStateSchema = z.object({});
export type AgendaStateSchemaType = z.infer<typeof AgendaStateSchema>;

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
}
