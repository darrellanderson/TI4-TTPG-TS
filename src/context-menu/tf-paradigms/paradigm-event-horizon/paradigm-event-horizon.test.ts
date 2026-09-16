import { Card, GameObject, Player } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";
import { MockCard, MockGameObject, MockPlayer } from "ttpg-mock";
import { ParadigmEventHorizon } from "./paradigm-event-horizon";
import { UnitPlastic } from "../../../lib/unit-lib/unit-plastic/unit-plastic";
import { UnitType } from "../../../lib/unit-lib/schema/unit-attrs-schema";

it("constructor, init", () => {
  new ParadigmEventHorizon().init();
});

it("right click", () => {
  new ParadigmEventHorizon().init();
  const card: MockCard = MockCard.simple(
    "card.tf-paradigm:twilights-fall/event-horizon"
  );
  process.flushTicks(); // card event delayed a frame

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Event Horizon");
});

it("_getDimensionalTearHexes", () => {
  MockGameObject.simple(
    "token.attachment.system:pok/dimensional-tear.vuilraith"
  );
  MockGameObject.simple("token.attachment.system:pok/dimensional-tear.nekro");
  const hero = new ParadigmEventHorizon();
  const includeNekro: boolean = true;
  const hexes: Set<HexType> = hero._getDimensionalTearHexes(includeNekro);
  expect(hexes.size).toBe(1);
});

it("_getInAndAdjacentHexes", () => {
  // Must have system tiles for adjacency.
  MockGameObject.simple("tile.system:base/18", {
    position: TI4.hex.toPosition("<0,0,0>"),
  });
  MockGameObject.simple("tile.system:base/19", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  const hexes: Set<HexType> = new Set(["<0,0,0>"]);
  expect(hexes.size).toBe(1);
  expect(hexes.has("<0,0,0>")).toBe(true);

  const hero = new ParadigmEventHorizon();
  const playerSlot: number = 10;
  const adjHexes: Set<HexType> = hero._getInAndAdjacentHexes(hexes, playerSlot);
  expect(adjHexes.size).toBe(2);
});

it("_eventHorizon", () => {
  const playerSlotActing: number = 10;
  const playerSlotOpponent: number = 11;

  // Tear system.
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple(
    "token.attachment.system:pok/dimensional-tear.vuilraith"
  );
  const opponentCarrier: GameObject = MockGameObject.simple("unit:base/carrier", {
    owningPlayerSlot: playerSlotOpponent,
    position: TI4.hex.toPosition("<0,0,0>"),
  });

  // Adjacent system.
  MockGameObject.simple("tile.system:base/19", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  // Opponent's destroyer in adjacent system.
  const opponentDestroyer: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: playerSlotOpponent,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  // Opponent's fighter in adjacent system (should be ignored).
  const opponentFighter: GameObject = MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: playerSlotOpponent,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  // Acting player's dreadnought in adjacent system (should be ignored).
  const actingDreadnought: GameObject = MockGameObject.simple("unit:base/dreadnought", {
    owningPlayerSlot: playerSlotActing,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  const hero = new ParadigmEventHorizon();

  // Check intermediate state.
  {
    const dimensionalTearHexes: Set<HexType> = hero._getDimensionalTearHexes(true);
    expect(Array.from(dimensionalTearHexes)).toEqual(["<0,0,0>"]);

    const inAndAdjacentHexes: Set<HexType> = hero._getInAndAdjacentHexes(
      dimensionalTearHexes,
      playerSlotActing
    );
    expect(Array.from(inAndAdjacentHexes)).toEqual(["<0,0,0>", "<1,0,-1>"]);

    const hexToNonFighterShips: Map<HexType, Array<UnitPlastic>> =
      hero._getHexToNonFighterShips();

    expect(hexToNonFighterShips.get("<0,0,0>")?.length).toBe(1); // carrier
    expect(hexToNonFighterShips.get("<1,0,-1>")?.length).toBe(2); // dreadnought, destroyer (fighter excluded)
  }

  const card: Card = MockCard.simple(
    "card.tf-paradigm:twilights-fall/event-horizon"
  );

  // Action!
  hero._paradigmEventHorizon(card, playerSlotActing);

  // Opponent non-fighter ships should have been rolled for (UI added by applyRiftResult).
  expect(opponentCarrier.getUIs().length).toBe(1);
  expect(opponentDestroyer.getUIs().length).toBe(1);

  // Opponent fighter and acting player's ships should be ignored.
  expect(opponentFighter.getUIs().length).toBe(0);
  expect(actingDreadnought.getUIs().length).toBe(0);
});
