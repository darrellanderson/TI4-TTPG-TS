import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { AgendaState } from "../agenda-state/agenda-state";
import {
  AgendaActivityMaybeResume,
  AgendaActivityStart,
} from "./agenda-activity-start";
import { Card } from "@tabletop-playground/api";

it("maybe resume (no)", () => {
  new AgendaActivityMaybeResume().init();
  process.flushTicks();
});

it("maybe resume (yes)", () => {
  const card: Card = MockCard.simple("card.agenda:my-source/my-name");
  new AgendaState("@ti4/agenda-state").setAgendaObjId(card.getId());
  new AgendaActivityMaybeResume().init();
  process.flushTicks();
});

it("constructor", () => {
  new AgendaActivityStart();
});

it("start/destroy", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("token:base/speaker");
  const agendaCard: Card = MockCard.simple("card.agenda:my-source/my-name");

  const agendaActivityStart: AgendaActivityStart = new AgendaActivityStart();
  agendaActivityStart.start(agendaCard);
  TI4.events.onAgendaCardRemoved.trigger();
  agendaActivityStart.destroy();
});
