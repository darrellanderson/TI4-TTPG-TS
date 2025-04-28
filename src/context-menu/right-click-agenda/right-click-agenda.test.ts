import { MockCard, MockGameObject, MockPlayer, MockSnapPoint } from "ttpg-mock";
import {
  ACTION_PLACE_BOTTOM,
  ACTION_PLACE_TOP,
  RightClickAgenda,
} from "./right-click-agenda";
import { Card, Player } from "@tabletop-playground/api";
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
  new RightClickAgenda().init();

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
  new RightClickAgenda().init();

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
