import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaStateUI } from "./agenda-state-ui";

it("constructor/event/destroy", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const scale: number = 1;
  const agendaStateUI: AgendaStateUI = new AgendaStateUI(agendaState, scale);
  agendaState.onAgendaStateChanged.trigger(agendaState);
  agendaStateUI.destroy();
});
