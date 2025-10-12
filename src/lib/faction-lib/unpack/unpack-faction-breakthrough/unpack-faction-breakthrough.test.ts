import { Card, CardHolder, Container } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { UnpackFactionBreakthrough } from "./unpack-faction-breakthrough";
import { MockCard, MockCardHolder, MockContainer } from "ttpg-mock";

it("unpack/remove", () => {
  TI4.config.setSources(["thunders-edge"]);
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionBreakthrough(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow();
  unpack.remove();
});

it("_dealBreakthroughCardsAndDeleteDeck", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  const deck: Card = MockCard.simple(
    "card.breakthrough:thunders-edge/stellar-genesis"
  );

  const factionExtrasContainer: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: playerSlot,
  });
  expect(factionExtrasContainer.getNumItems()).toBe(0);

  const unpack = new UnpackFactionBreakthrough(faction, playerSlot);
  unpack._dealBreakthroughCardsAndDeleteDeck(deck);
  expect(factionExtrasContainer.getNumItems()).toBe(1);
});

it("_dealBreakthroughCardsAndDeleteDeck (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  const deck: Card = MockCard.simple(
    "card.breakthrough:thunders-edge/__other__"
  );

  const factionExtrasContainer: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: playerSlot,
  });
  expect(factionExtrasContainer.getNumItems()).toBe(0);

  const unpack = new UnpackFactionBreakthrough(faction, playerSlot);
  expect(() => {
    unpack._dealBreakthroughCardsAndDeleteDeck(deck);
  }).toThrow();
});

it("_getFactionExtrasContainerOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  const factionExtrasContainer: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackFactionBreakthrough(faction, playerSlot);
  const found: Container = unpack._getFactionExtrasContainerOrThrow();
  expect(found).toBe(factionExtrasContainer);
});

it("_getFactionExtrasContainerOrThrow (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionBreakthrough(faction, playerSlot);
  expect(() => {
    unpack._getFactionExtrasContainerOrThrow();
  }).toThrow(/Faction extras container not found/);
});

it("remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;
  const cardHolder: CardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const card1: Card = MockCard.simple(
    "card.breakthrough:thunders-edge/stellar-genesis"
  );
  const card2: Card = MockCard.simple(
    "card.breakthrough:thunders-edge/stellar-genesis"
  );
  const card3: Card = MockCard.simple(
    "card.breakthrough:thunders-edge/stellar-genesis"
  );

  cardHolder.insert(card2, 0);

  const container: Container = new MockContainer();
  container.insert([card3]);

  expect(card1.isValid()).toBe(true);
  expect(card2.isValid()).toBe(true);
  expect(card3.isValid()).toBe(true);

  const unpack = new UnpackFactionBreakthrough(faction, playerSlot);
  unpack.remove();

  expect(card1.isValid()).toBe(false);
  expect(card2.isValid()).toBe(false);
  expect(card3.isValid()).toBe(false);
});
