import { Card, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { AgendaActivityStart } from "../../lib/agenda-lib/agenda-activity-start/agenda-activity-start";

export class OnAgendaCard implements IGlobal {
  init(): void {
    TI4.events.onAgendaCard.add((agendaCard: Card, _player: Player) => {
      new AgendaActivityStart().start(agendaCard);
    });
  }
}
