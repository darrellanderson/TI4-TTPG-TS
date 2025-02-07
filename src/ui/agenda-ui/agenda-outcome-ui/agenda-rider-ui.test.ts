import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaRiderUI } from "./agenda-rider-ui";

it("constructor, event", () => {
  const agendaState = new AgendaState("@test/test");
  new AgendaRiderUI(agendaState, 1);
  agendaState.onAgendaStateChanged.trigger(agendaState);
});
