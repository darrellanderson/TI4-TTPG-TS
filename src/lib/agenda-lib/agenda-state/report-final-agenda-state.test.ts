import { AgendaState } from "./agenda-state";
import { ReportFinalAgendaState } from "./report-final-agenda-state";

it("constructor", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  new ReportFinalAgendaState(agendaState);
});
