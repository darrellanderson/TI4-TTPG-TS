import { GameObject, Player } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";
import { MockCard, MockGameObject, MockPlayer } from "ttpg-mock";
import { HeroDimensionalAnchor } from "./hero-dimensional-anchor";
import { UnitPlastic } from "../../../lib/unit-lib/unit-plastic/unit-plastic";
import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";

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

it("_getAdjacentHexes", () => {
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
  const adjHexes: Set<HexType> = hero._getAdjacentHexes(hexes, playerSlot);
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
