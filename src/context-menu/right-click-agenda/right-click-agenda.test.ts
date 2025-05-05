import { MockCard, MockGameObject, MockPlayer, MockSnapPoint } from "ttpg-mock";
import {
  ACTION_PLACE_BOTTOM,
  ACTION_PLACE_TOP,
  RightClickAgenda,
} from "./right-click-agenda";
import { Card, GameObject, Player } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

it("constructor/init", () => {
  new RightClickAgenda().init();
});

it("_onSingletonCardMadeDeck", () => {
  new RightClickAgenda().init();

  const agendaCard1: MockCard = MockCard.simple(
    "card.agenda:my-source/my-name-1"
  );
  const agendaCard2: MockCard = MockCard.simple(
    "card.agenda:my-source/my-name-2"
  );
  agendaCard1.addCards(agendaCard2);
  process.flushTicks();
});

it("place top", () => {
  // Use global version.
  // new RightClickAgenda().init();

  const agendaDeck: Card = MockCard.simple("card.agenda:orig:orig");
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-agenda"],
        snappedObject: agendaDeck,
      }),
    ],
  });

  const agendaCard: MockCard = MockCard.simple("card.agenda:my-source/my-name");
  process.flushTicks();

  const player: Player = new MockPlayer();
  agendaCard._customActionAsPlayer(player, ACTION_PLACE_TOP);

  const nsids: Array<string> = NSID.getDeck(agendaDeck);
  expect(nsids).toEqual([
    "card.agenda:orig:orig",
    "card.agenda:my-source/my-name",
  ]);
});

it("place bottom", () => {
  // Use global version.
  // new RightClickAgenda().init();

  const agendaDeck: Card = MockCard.simple("card.agenda:orig:orig");
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-agenda"],
        snappedObject: agendaDeck,
      }),
    ],
  });

  const agendaCard: MockCard = MockCard.simple("card.agenda:my-source/my-name");
  process.flushTicks();

  const player: Player = new MockPlayer();
  agendaCard._customActionAsPlayer(player, ACTION_PLACE_BOTTOM);

  const nsids: Array<string> = NSID.getDeck(agendaDeck);
  expect(nsids).toEqual([
    "card.agenda:my-source/my-name",
    "card.agenda:orig:orig",
  ]);
});

it("_onStrategyCardPlayed", () => {
  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/politics"
  );
  const player: Player = new MockPlayer();
  TI4.events.onStrategyCardPlayed.trigger(strategyCard, player);
});

it("_getAgendaDeck", () => {
  const agendaDeck: Card = new MockCard();
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-agenda"],
        snappedObject: agendaDeck,
      }),
    ],
  });

  const rightClickAgenda: RightClickAgenda = new RightClickAgenda();
  const deck: Card | undefined = rightClickAgenda._getAgendaDeck();
  expect(deck).toEqual(agendaDeck);
});

it("_clearAgendaDeckDescription", () => {
  const agendaDeck: Card = new MockCard({ description: "old desc" });
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-agenda"],
        snappedObject: agendaDeck,
      }),
    ],
  });
  expect(agendaDeck.getDescription()).toEqual("old desc");

  const rightClickAgenda: RightClickAgenda = new RightClickAgenda();
  rightClickAgenda._clearAgendaDeckDescription();
  expect(agendaDeck.getDescription()).toEqual("");
});

it("_addAgendaDeckDescription", () => {
  const agendaDeck: Card = new MockCard({ description: "old desc" });
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-agenda"],
        snappedObject: agendaDeck,
      }),
    ],
  });
  expect(agendaDeck.getDescription()).toEqual("old desc");

  const rightClickAgenda: RightClickAgenda = new RightClickAgenda();
  rightClickAgenda._addAgendaDeckDescription("new desc");
  expect(agendaDeck.getDescription()).toEqual("old desc\nnew desc");
});
