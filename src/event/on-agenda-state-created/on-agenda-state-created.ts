import { IGlobal } from "ttpg-darrell";
import { AdvanceNoWhensAfters } from "../../lib/agenda-lib/agenda-state/advance-no-whens-afters";
import { AgendaState } from "../../lib/agenda-lib/agenda-state/agenda-state";
import { ReportFinalAgendaState } from "../../lib/agenda-lib/agenda-state/report-final-agenda-state";

export class OnAgendaStateCreated implements IGlobal {
  init(): void {
    TI4.events.onAgendaStateCreated.add((agendaState: AgendaState) => {
      new AdvanceNoWhensAfters(agendaState);
      new ReportFinalAgendaState(agendaState);
    });
  }
}
