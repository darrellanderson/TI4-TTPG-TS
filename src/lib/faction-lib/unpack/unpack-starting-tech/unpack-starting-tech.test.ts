import {
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
