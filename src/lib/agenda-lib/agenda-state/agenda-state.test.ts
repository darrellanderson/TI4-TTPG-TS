import { NamespaceId } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";

it("constructor/destroy/static isAgendaInProgress", () => {
  const id: NamespaceId = "@test/test";
  expect(AgendaState.isAgendaInProgress(id)).toBe(false);

  const agendaState: AgendaState = new AgendaState(id);
  expect(AgendaState.isAgendaInProgress(id)).toBe(true);

  agendaState.destroy();
  expect(AgendaState.isAgendaInProgress(id)).toBe(false);
});
