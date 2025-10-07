import { Card, GameObject, Player } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";

import { AgendaState } from "../../lib/agenda-lib/agenda-state/agenda-state";
import { ReportFinalAgendaState } from "../../lib/agenda-lib/agenda-state/report-final-agenda-state";
import { ACTION_CLEAR_PREDICT, RightClickRider } from "./right-click-rider";

it("static _getOutcomeNames", () => {
  const agendaState = new AgendaState("@test/test");
  agendaState.setOutcomeName(0, "foo");
  agendaState.setOutcomeName(1, "bar");
  expect(RightClickRider._getOutcomeNames(agendaState)).toEqual(["foo", "bar"]);
});

it("static isRider", () => {
  const no: GameObject = MockGameObject.simple("type:source/name");
  const yes: GameObject = MockGameObject.simple("type:source/name|rider|foo");
  expect(RightClickRider.isRider(no)).toBe(false);
  expect(RightClickRider.isRider(yes)).toBe(true);
});

it("constructor/init", () => {
  new MockGameObject(); // so an object exists for init to find
  new RightClickRider().init();
  const agendaState = new AgendaState("@test/test");
  agendaState.onAgendaStateChanged.trigger(agendaState);
});

it("add/remove obj", () => {
  new RightClickRider().init();
  const obj: GameObject = MockGameObject.simple("type:source/name|rider");
  obj.destroy();
});

it("edit outcomes", () => {
  new RightClickRider().init();
  const agendaState = new AgendaState("@test/test");
  agendaState.setOutcomeName(0, "foo");
});

it("agenda state complete", () => {
  TI4.config.setPlayerCount(2);
  MockGameObject.simple("type:source/name|rider");
  new RightClickRider().init();

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setOutcomeName(0, "foo");

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [1, 0, 0],
  });
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(10)).toBe(0);
  expect(TI4.playerSeats.getSeatIndexByPlayerSlot(11)).toBe(1);
  expect(agendaState.isComplete()).toBe(false);

  agendaState.setPhase("voting");

  TI4.turnOrder.setTurnOrder([10, 11], "forward", 11);
  expect(agendaState.isComplete()).toBe(false);

  agendaState.setSeatVotesLocked(0, true);
  agendaState.setSeatVotesLocked(1, true);
  expect(agendaState.isComplete()).toBe(true);
});

it("onCustomAction", () => {
  const rider: MockGameObject = MockGameObject.simple("type:source/name|rider");
  new RightClickRider().init();

  const agendaState: AgendaState = new AgendaState("@test/test");
  agendaState.setOutcomeName(0, "foo");
  expect(agendaState.getRiders()).toEqual([]);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 0, 0],
  });
  const player: Player = new MockPlayer({ slot: 10 });
  rider._customActionAsPlayer(player, "foo");

  expect(agendaState.getRiders()).toEqual([
    { objId: rider.getId(), outcome: 0, seat: 0 },
  ]);

  rider._customActionAsPlayer(player, ACTION_CLEAR_PREDICT);
  expect(agendaState.getRiders()).toEqual([]);
});

it("singleton card, deck", () => {
  new RightClickRider().init();

  const card1: Card = new MockCard();
  const card2: Card = new MockCard();
  card1.addCards(card2);
  process.flushTicks();
  card1.takeCards();
  process.flushTicks();
});
