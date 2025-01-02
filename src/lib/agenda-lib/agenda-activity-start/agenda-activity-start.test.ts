import { MockCard } from "ttpg-mock";
import { AgendaState } from "../agenda-state/agenda-state";
import {
  AgendaActivityMaybeResume,
  AgendaActivityStart,
} from "./agenda-activity-start";
import { Card } from "@tabletop-playground/api";

it("maybe resume (no)", () => {
  new AgendaActivityMaybeResume().init();
});

it("maybe resume (yes)", () => {
  new AgendaState("@ti4/agenda");
  new AgendaActivityMaybeResume().init();
});

it("constructor", () => {
  new AgendaActivityStart();
});

it("start/destroy", () => {
  const agendaCard: Card = MockCard.simple("card.agenda:my-source/my-name");

  const agendaActivityStart: AgendaActivityStart = new AgendaActivityStart();
  agendaActivityStart.start(agendaCard);
  agendaActivityStart.destroy();
});
