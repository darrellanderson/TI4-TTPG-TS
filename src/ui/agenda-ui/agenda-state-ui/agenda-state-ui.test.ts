import { Card } from "@tabletop-playground/api";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaStateUI } from "./agenda-state-ui";
import { MockCard } from "ttpg-mock";

it("static _createAgendaCardUI", () => {
  const agendaCard: Card = MockCard.simple("card.agenda:my-source/my-name");
  const agendaState: AgendaState = new AgendaState("@test/test").setAgendaObjId(
    agendaCard.getId()
  );
  const scale: number = 1;
  AgendaStateUI._createAgendaCardUI(agendaState, scale);
});

it("static _createAgendaCardUI (no agenda card)", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const scale: number = 1;
  expect(() => {
    AgendaStateUI._createAgendaCardUI(agendaState, scale);
  }).toThrow("Agenda card missing or not card");
});

it("constructor/event/destroy", () => {
  const agendaCard: Card = MockCard.simple("card.agenda:my-source/my-name");
  const agendaState: AgendaState = new AgendaState("@test/test").setAgendaObjId(
    agendaCard.getId()
  );
  const seatIndex: number = 0;
  const scale: number = 1;
  const agendaStateUI: AgendaStateUI = new AgendaStateUI(
    agendaState,
    seatIndex,
    scale
  );
  agendaState.onAgendaStateChanged.trigger(agendaState);
  agendaStateUI.destroy();
});
