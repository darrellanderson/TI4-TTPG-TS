import { NamespaceId } from "ttpg-darrell";
import { AgendaState } from "./agenda-state";

it("constructor/destroy/static isAgendaInProgress", () => {
  const id: NamespaceId = "@test/test";
  expect(AgendaState.isAgendaInProgress(id)).toBe(false);

  const agendaState: AgendaState = new AgendaState(id);
  expect(AgendaState.isAgendaInProgress(id)).toBe(true);
  expect(agendaState.isActive()).toBe(true);

  agendaState.destroy();
  expect(AgendaState.isAgendaInProgress(id)).toBe(false);
  expect(agendaState.isActive()).toBe(false);
});

it("agenda obj id", () => {
  const id: NamespaceId = "@test/test";
  const agendaState: AgendaState = new AgendaState(id);
  expect(agendaState.getAgendaObjId()).toBe("");
  agendaState.setAgendaObjId("agenda");
  expect(agendaState.getAgendaObjId()).toBe("agenda");
  agendaState.destroy();
});
