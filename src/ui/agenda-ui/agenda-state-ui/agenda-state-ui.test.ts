import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaStateUI } from "./agenda-state-ui";

it("constructor/destroy", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const scale: number = 1;
  new AgendaStateUI(agendaState, scale).destroy();
});
