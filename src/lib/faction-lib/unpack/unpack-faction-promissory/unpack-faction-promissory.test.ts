import { MockCard, MockCardDetails, MockCardHolder } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackFactionPromissory } from "./unpack-faction-promissory";
import { Card } from "@tabletop-playground/api";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionPromissory(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/Missing promissory cards/);
  unpack.remove();
});

it("_dealPromissoryCardsAndDeleteDeck", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionPromissory(faction, playerSlot);

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ metadata: "card.promissory:base/stymie" }),
      new MockCardDetails({ metadata: "_other_" }),
    ],
  });

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  unpack._dealPromissoryCardsAndDeleteDeck(deck);
});

it("remove (find card)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionPromissory(faction, playerSlot);

  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ metadata: "card.promissory:base/stymie" }),
    ],
  });

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  expect(card.isValid()).toBe(true);
  unpack.remove();
  expect(card.isValid()).toBe(false);
});
