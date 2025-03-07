import { Card, GameObject, Player } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";
import { MockCard, MockGameObject, MockPlayer } from "ttpg-mock";
import { HeroDimensionalAnchor } from "./hero-dimensional-anchor";
import { UnitPlastic } from "../../../lib/unit-lib/unit-plastic/unit-plastic";
import { UnitType } from "../../../lib/unit-lib/schema/unit-attrs-schema";

it("constructor, init", () => {
  new HeroDimensionalAnchor().init();
});

it("right click", () => {
  new HeroDimensionalAnchor().init();
  const card: MockCard = MockCard.simple(
    "card.leader.hero:pok/it-feeds-on-carrion"
  );
  process.flushTicks(); // card event delayed a frame

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Dimensional Anchor");
});

it("_getDimensionalTearHexes", () => {
  MockGameObject.simple(
    "token.attachment.system:pok/dimensional-tear.vuilraith"
  );
  MockGameObject.simple("token.attachment.system:pok/dimensional-tear.nekro");
  const hero = new HeroDimensionalAnchor();
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

  const hero = new HeroDimensionalAnchor();
  const playerSlot: number = 10;
  const adjHexes: Set<HexType> = hero._getInAndAdjacentHexes(hexes, playerSlot);
  expect(adjHexes.size).toBe(2);
});

it("_getHexToShipsIncludingFighters", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("unit:base/fighter");
  MockGameObject.simple("unit:base/infantry");
  MockGameObject.simple("unit:base/dreadnought");

  const hero = new HeroDimensionalAnchor();
  const hexToNonFighterShips: Map<
    HexType,
    Array<UnitPlastic>
  > = hero._getHexToShipsIncludingFighters();
  expect(hexToNonFighterShips.size).toBe(1);

  const unitPlastics: Array<UnitPlastic> =
    hexToNonFighterShips.get("<0,0,0>") || [];
  const unitTypes: Array<UnitType> = unitPlastics.map((unitPlastic) =>
    unitPlastic.getUnit()
  );
  unitTypes.sort();
  expect(unitTypes).toEqual(["dreadnought", "fighter"]);
});

it("_getShipOwners", () => {
  const fighter: GameObject = MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 10,
  });
  const fighterPlastic: UnitPlastic | undefined = UnitPlastic.getOne(fighter);
  if (!fighterPlastic) {
    throw new Error("Plastic not found");
  }

  const hero = new HeroDimensionalAnchor();
  const owners: Set<PlayerSlot> = hero._getShipOwners([fighterPlastic]);
  expect(owners.size).toBe(1);
  expect(owners.has(10)).toBe(true);
});

it("_getNonFighterShips", () => {
  const fighter: GameObject = MockGameObject.simple("unit:base/fighter", {
    owningPlayerSlot: 10,
  });
  const dreadnought: GameObject = MockGameObject.simple(
    "unit:base/dreadnought",
    {
      owningPlayerSlot: 10,
    }
  );
  const fighterPlastic: UnitPlastic | undefined = UnitPlastic.getOne(fighter);
  const dreadnoughtPlastic: UnitPlastic | undefined =
    UnitPlastic.getOne(dreadnought);
  if (!fighterPlastic || !dreadnoughtPlastic) {
    throw new Error("Plastic not found");
  }
  const plastics: Array<UnitPlastic> = [fighterPlastic, dreadnoughtPlastic];
  const filtered: Array<UnitPlastic> =
    new HeroDimensionalAnchor()._getNonFighterShips(plastics);
  expect(filtered.length).toBe(1);
  expect(filtered).toEqual([dreadnoughtPlastic]);
});

it("_getNonBlockadedShips", () => {
  const destroyer: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 10,
  });
  const dreadnought: GameObject = MockGameObject.simple(
    "unit:base/dreadnought",
    {
      owningPlayerSlot: 11,
    }
  );
  const destroyerPlastic: UnitPlastic | undefined =
    UnitPlastic.getOne(destroyer);
  const dreadnoughtPlastic: UnitPlastic | undefined =
    UnitPlastic.getOne(dreadnought);
  if (!destroyerPlastic || !dreadnoughtPlastic) {
    throw new Error("Plastic not found");
  }
  const plastics: Array<UnitPlastic> = [destroyerPlastic, dreadnoughtPlastic];
  const blockadingPlayerSlots: Set<PlayerSlot> = new Set([11]);
  const filtered: Array<UnitPlastic> =
    new HeroDimensionalAnchor()._getNonBlockadedShips(
      plastics,
      blockadingPlayerSlots
    );
  expect(filtered.length).toBe(1);
  expect(filtered).toEqual([destroyerPlastic]);
});

it("_dimensionalAnchor", () => {
  const playerslotActing: number = 12;
  const playerSlotBlockading: number = 11;
  const playerSlotCapturable: number = 10;

  // Tear system.
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple(
    "token.attachment.system:pok/dimensional-tear.vuilraith"
  );
  MockGameObject.simple("unit:base/carrier", {
    owningPlayerSlot: playerSlotBlockading,
  });

  // Adjacent system.
  MockGameObject.simple("tile.system:base/19", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  const yes: GameObject = MockGameObject.simple("unit:base/dreadnought", {
    owningPlayerSlot: playerSlotCapturable,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  const no: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: playerSlotBlockading,
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  const hero = new HeroDimensionalAnchor();

  // Check intermediate state.
  {
    const dimensionalTearHexes: Set<HexType> =
      hero._getDimensionalTearHexes(true); // include Nekro
    expect(Array.from(dimensionalTearHexes)).toEqual(["<0,0,0>"]);

    const inAndAdjacentHexes: Set<HexType> = hero._getInAndAdjacentHexes(
      dimensionalTearHexes,
      playerslotActing
    );
    expect(Array.from(inAndAdjacentHexes)).toEqual(["<0,0,0>", "<1,0,-1>"]);

    const blockadableHexes: Set<HexType> = hero._getDimensionalTearHexes(false); // exclude Nekro
    expect(Array.from(blockadableHexes)).toEqual(["<0,0,0>"]);

    const hexToShipsIncludingFighters: Map<
      HexType,
      Array<UnitPlastic>
    > = hero._getHexToShipsIncludingFighters();

    const blockadingShips: Array<UnitPlastic> | undefined =
      hexToShipsIncludingFighters.get("<0,0,0>");
    if (!blockadingShips) {
      throw new Error("No blockading");
    }
    const blockading: Set<PlayerSlot> = hero._getShipOwners(blockadingShips);
    expect(Array.from(blockading)).toEqual([playerSlotBlockading]);

    const adjShips: Array<UnitPlastic> | undefined =
      hexToShipsIncludingFighters.get("<1,0,-1>");
    if (!adjShips) {
      throw new Error("No adjacent");
    }
    const nonFighterShips: Array<UnitPlastic> =
      hero._getNonFighterShips(adjShips);
    expect(nonFighterShips.map((unitPlastic) => unitPlastic.getUnit())).toEqual(
      ["dreadnought", "destroyer"]
    );
    const nonBlockadedShips: Array<UnitPlastic> = hero._getNonBlockadedShips(
      nonFighterShips,
      blockading
    );
    expect(
      nonBlockadedShips.map((unitPlastic) => unitPlastic.getUnit())
    ).toEqual(["dreadnought"]);
  }

  const card: Card = MockCard.simple(
    "card.leader.hero:pok/it-feeds-on-carrion"
  );
  const playerSlot: number = no.getOwningPlayerSlot();
  hero._dimensionalAnchor(card, playerSlot);

  expect(no.getUIs().length).toBe(0);
  expect(yes.getUIs().length).toBe(1);
});
