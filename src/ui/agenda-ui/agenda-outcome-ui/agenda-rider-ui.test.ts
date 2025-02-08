import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaRiderUI } from "./agenda-rider-ui";

it("constructor, event", () => {
  const agendaState = new AgendaState("@test/test");
  const outcomeIndex: number = 0;
  const scale: number = 1;
  new AgendaRiderUI(agendaState, outcomeIndex, scale);
  agendaState.onAgendaStateChanged.trigger(agendaState);
});
