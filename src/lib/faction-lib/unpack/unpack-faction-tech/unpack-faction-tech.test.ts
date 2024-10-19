import { Card } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";

import { Faction } from "../../faction/faction";
import { UnpackFactionTech } from "./unpack-faction-tech";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const existingTechDeck: Card = new MockCard();
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-technology"],
        snappedObject: existingTechDeck,
      }),
    ],
  });

  const unpack = new UnpackFactionTech(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("_filterFactionTech", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails(),
      new MockCardDetails({
        metadata: "card.technology.unit-upgrade:base/letani-warrior-2",
      }),
    ],
  });

  const unpack = new UnpackFactionTech(faction, playerSlot);
  const filtered: Card | undefined = unpack._filterFactionTech(deck);
  expect(filtered).toBeDefined();
});

it("unpack missing tech deck", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionTech(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/tech deck/);
});

it("remove missing tech deck", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionTech(faction, playerSlot);
  expect(() => {
    unpack.remove();
  }).toThrow(/tech deck/);
});

it("remove (faction tech present)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const existingTechDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.technology.unit-upgrade:base/letani-warrior-2",
      }),
    ],
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-technology"],
        snappedObject: existingTechDeck,
      }),
    ],
  });

  const unpack = new UnpackFactionTech(faction, playerSlot);
  unpack.remove();
});
