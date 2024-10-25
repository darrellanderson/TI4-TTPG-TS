import { MockCard, MockCardHolder } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "./abstract-unpack";
import { Card, CardHolder } from "@tabletop-playground/api";

class MyUnpack extends AbstractUnpack {
  constructor() {
    const faction: Faction = TI4.factionRegistry.getByNsid(
      "faction:bace/arborec"
    )!;
    const playerSlot: number = 10;
    super(faction, playerSlot);
  }
  unpack(): void {}
  remove(): void {}
}

it("dealToPlayerOrThrow", () => {
  const unpack = new MyUnpack();

  const _holder: CardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const card: Card = new MockCard();
  unpack.dealToPlayerOrThrow(card);
});

it("dealToPlayerOrThrow (missing card holder)", () => {
  const unpack = new MyUnpack();

  const card: Card = new MockCard();
  expect(() => {
    unpack.dealToPlayerOrThrow(card);
  }).toThrow(/Missing player hand holder/);
});

it("getPlayerHandHolderOrThrow", () => {
  const unpack = new MyUnpack();

  const holder: CardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  expect(unpack.getPlayerHandHolderOrThrow()).toEqual(holder);
});

it("getPlayerHandHolderOrThrow (missing card holder)", () => {
  const unpack = new MyUnpack();

  expect(() => {
    unpack.getPlayerHandHolderOrThrow();
  }).toThrow(/Missing player hand holder/);
});

it("spawnDeckAndFilterSourcesOrThrow", () => {
  const unpack = new MyUnpack();

  const deck = unpack.spawnDeckAndFilterSourcesOrThrow("card.alliance:");
  expect(deck).toBeDefined();
});

it("spawnDeckAndFilterSourcesOrThrow (unknkown deck)", () => {
  const unpack = new MyUnpack();

  expect(() => {
    unpack.spawnDeckAndFilterSourcesOrThrow("_does_not_exist_");
  }).toThrow(/Missing deck/);
});
