import {
  GameObject,
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackStartingTech } from "./unpack-starting-tech";
import { Card, SnapPoint } from "@tabletop-playground/api";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const techDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.technology.red:base/magen-defense-grid",
      }),
      new MockCardDetails({
        metadata: "card.technology.red:codex.ordinian/magen-defense-grid.omega",
      }),
      new MockCardDetails({
        metadata: "card.technology.unit-upgrade:base/carrier-2",
      }),
    ],
  });
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: techDeck,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const unpack = new UnpackStartingTech(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("unpack/remove (no starting tech)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/norr")!;
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const techDeck: Card = new MockCard();
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: techDeck,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const unpack = new UnpackStartingTech(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("unpack/remove (missing all starting tech)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const techDeck: Card = new MockCard();
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: techDeck,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const unpack = new UnpackStartingTech(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/starting tech/);
});

it("_getTechDeckOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const techDeck: Card = new MockCard();
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: techDeck,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const unpack = new UnpackStartingTech(faction, playerSlot);
  const result: Card = unpack._getTechDeckOrThrow();
  expect(result).toBe(techDeck);
});

it("_getTechDeckOrThrow (missing snap point)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackStartingTech(faction, playerSlot);
  expect(() => {
    unpack._getTechDeckOrThrow();
  }).toThrow(/no snap point/);
});

it("_getTechDeckOrThrow (no snapped object)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const unpack = new UnpackStartingTech(faction, playerSlot);
  expect(() => {
    unpack._getTechDeckOrThrow();
  }).toThrow(/no snapped object/);
});

it("_getTechDeckOrThrow (snapped object not a card)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const snappedObject: GameObject = new MockGameObject();
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-technology"],
    snappedObject: snappedObject,
  });
  new MockGameObject({
    templateMetadata: "mat.player:base/technology-deck",
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });

  const unpack = new UnpackStartingTech(faction, playerSlot);
  expect(() => {
    unpack._getTechDeckOrThrow();
  }).toThrow(/not a card/);
});
