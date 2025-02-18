import { AgendaState } from "../agenda-state/agenda-state";

export const AGENDA_OUTCOME_TYPE_TO_LABEL: Record<string, string> = {
  "for-against": "For/Against",
  player: "Elect Player",
  "strategy-card": "Elect Strategy Card",
  other: "Other",
};

export class AgendaOutcomes {
  /**
   * Do the populate as a transaction (rider processing gets batched).
   *
   * @param agendaState
   * @param outcomeType
   * @returns
   */
  populate(agendaState: AgendaState, outcomeType: string): boolean {
    let result: boolean = false;
    agendaState.transactThenTriggerDelayedStateChangedEvent(() => {
      result = this._populate(agendaState, outcomeType);
    });
    return result;
  }

  _populate(agendaState: AgendaState, outcomeType: string): boolean {
    let index: number = 0;
    if (outcomeType === "for-against") {
      agendaState.setOutcomeName(index++, "For");
      agendaState.setOutcomeName(index++, "Against");
      return true;
    }

    if (outcomeType === "player") {
      for (const seat of TI4.playerSeats.getAllSeats()) {
        const name: string = TI4.playerName.getBySlot(seat.playerSlot);
        agendaState.setOutcomeName(index++, name);
      }
      return true;
    }

    if (outcomeType === "strategy-card") {
      agendaState.setOutcomeName(index++, "Leadership");
      agendaState.setOutcomeName(index++, "Diplomacy");
      agendaState.setOutcomeName(index++, "Politics");
      agendaState.setOutcomeName(index++, "Construction");
      agendaState.setOutcomeName(index++, "Trade");
      agendaState.setOutcomeName(index++, "Warfare");
      agendaState.setOutcomeName(index++, "Technology");
      agendaState.setOutcomeName(index++, "Imperial");
      return true;
    }

    if (outcomeType === "other") {
      for (let index = 0; index < 8; index++) {
        agendaState.setOutcomeName(index, "");
      }
      return true;
    }

    return false;
  }

  populateOrThrow(agendaState: AgendaState, outcomeType: string): void {
    if (!this.populate(agendaState, outcomeType)) {
      throw new Error(`Unknown outcome type: ${outcomeType}`);
    }
  }
}
