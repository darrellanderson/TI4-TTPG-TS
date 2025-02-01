import { Card } from "@tabletop-playground/api";
import { clickAll, MockCard } from "ttpg-mock";

import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { AgendaStateUI } from "./agenda-state-ui";
import { AbstractUI } from "../../abstract-ui/abtract-ui";

it("static _createAgendaCardUI", () => {
  const agendaCard: Card = MockCard.simple("card.agenda:my-source/my-name");
  const agendaState: AgendaState = new AgendaState("@test/test").setAgendaObjId(
    agendaCard.getId()
  );
  const scale: number = 1;
  const abstractUi: AbstractUI = AgendaStateUI._createAgendaCardUI(
    agendaState,
    scale
  );
  clickAll(abstractUi.getWidget());
});

it("static _createAgendaCardUI (no agenda card)", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const scale: number = 1;
  expect(() => {
    AgendaStateUI._createAgendaCardUI(agendaState, scale);
  }).toThrow("Agenda card missing or not card");
});

it("static _createAvailableVotesUI", () => {
  const scale: number = 1;
  const abstractUi: AbstractUI = AgendaStateUI._createAvailableVotesRow(scale);
  clickAll(abstractUi.getWidget());
});

it("static _createWhensUI", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const abstractUi: AbstractUI = AgendaStateUI._createWhensRow(
    agendaState,
    seatIndex,
    scale
  );
  clickAll(abstractUi.getWidget());
});

it("static _createAftersUI", () => {
  const agendaState: AgendaState = new AgendaState("@test/test");
  const seatIndex: number = 0;
  const scale: number = 1;
  const abstractUi: AbstractUI = AgendaStateUI._createAftersRow(
    agendaState,
    seatIndex,
    scale
  );
  clickAll(abstractUi.getWidget());
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
