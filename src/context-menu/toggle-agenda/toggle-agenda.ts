import { globalEvents, Player, world } from "@tabletop-playground/api";
import { Broadcast, IGlobal, Window } from "ttpg-darrell";
import { AgendaActivityStart } from "../../lib/agenda-lib/agenda-activity-start/agenda-activity-start";

const ACTION_TOGGLE_AGENDA = "*Toggle Agenda";

export class ToggleAgenda implements IGlobal {
  private readonly _onCustomAction = (
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION_TOGGLE_AGENDA) {
      const window: Window | undefined = AgendaActivityStart.getAgendaWindow();
      if (window) {
        const playerSlot: number = player.getSlot();
        window.toggleForPlayer(playerSlot);
      } else {
        Broadcast.chatOne(player, "No agenda in progress", Broadcast.ERROR);
      }
    }
  };

  init(): void {
    globalEvents.onCustomAction.add(this._onCustomAction);
    world.addCustomAction(ACTION_TOGGLE_AGENDA);
  }
}
