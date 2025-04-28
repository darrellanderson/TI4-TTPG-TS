import { MockCard, MockCardHolder, MockPlayer } from "ttpg-mock";
import {
  ACTION_NAME_IIHQ_MODERNIZATION,
  IIHQ_MODERNIZATION_NSID,
  LEGENDARY_NSID,
  PLANET_NSID,
  RightClickIihqModernization,
} from "./right-click-iihq-modernization";
import { Card, CardHolder, Player } from "@tabletop-playground/api";

it("constructor/init", () => {
  new RightClickIihqModernization().init();
});

it("custom action", () => {
  new RightClickIihqModernization().init();

  const card: MockCard = MockCard.simple(IIHQ_MODERNIZATION_NSID);
  process.flushTicks();

  MockCard.simple(PLANET_NSID);
  MockCard.simple(LEGENDARY_NSID);
  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_NAME_IIHQ_MODERNIZATION);
});

it("getPlanetCard", () => {
  const planetCard: Card = MockCard.simple(PLANET_NSID);

  const rightClick: RightClickIihqModernization =
    new RightClickIihqModernization();
  const card: Card | undefined = rightClick.getPlanetCard();
  expect(card).toBe(planetCard);
});

it("getLegendaryCard", () => {
  const legendaryCard: Card = MockCard.simple(LEGENDARY_NSID);

  const rightClick: RightClickIihqModernization =
    new RightClickIihqModernization();
  const card: Card | undefined = rightClick.getLegendaryCard();
  expect(card).toBe(legendaryCard);
});

it("dealCardToPlayer", () => {
  const cardHolder: CardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const playerSlot: number = 10;
  const card: MockCard = MockCard.simple(PLANET_NSID);

  const rightClick: RightClickIihqModernization =
    new RightClickIihqModernization();
  rightClick.dealCardToPlayer(card, playerSlot);

  expect(card.getHolder()).toBe(cardHolder);
  expect(cardHolder.getCards()).toContain(card);
});
