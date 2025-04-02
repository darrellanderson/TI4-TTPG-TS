import { Card, Player } from "@tabletop-playground/api";
import { PlayerSlot, TurnOrder } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
import { AgendaState } from "../../agenda-lib/agenda-state/agenda-state";

export class AutoStreamerCamera {
  private readonly _streamerPlayerSlots: Set<PlayerSlot> = new Set();

  readonly _onAgendaCard = (_agendaCard: Card, _player: Player): void => {};

  readonly _onAgendaStateChanged = (agendaState: AgendaState): void => {
    const isActive: boolean = agendaState.isActive();
  };

  readonly _onAgendaStateCreated = (agendaState: AgendaState): void => {
    // AgendaState will remove the listener when destroyed.
    agendaState.onAgendaStateChanged.add(this._onAgendaStateChanged);
  };

  readonly _onSystemActivated = (system: System, _player: Player): void => {};

  readonly _onTurnStateChanged = (_turnOrder: TurnOrder): void => {};

  constructor() {
    TI4.events.onAgendaStateCreated.add(this._onAgendaStateCreated);
    TI4.events.onAgendaCard.add(this._onAgendaCard);
    TI4.events.onSystemActivated.add(this._onSystemActivated);
    TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
  }

  addStreamerPlayerSlot(playerSlot: PlayerSlot): void {
    this._streamerPlayerSlots.add(playerSlot);
  }

  removeStreamerPlayerSlot(playerSlot: PlayerSlot): void {
    this._streamerPlayerSlots.delete(playerSlot);
  }
}
