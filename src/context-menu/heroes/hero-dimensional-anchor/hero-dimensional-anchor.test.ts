import { Player } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockPlayer } from "ttpg-mock";
import { HeroDimensionalAnchor } from "./hero-dimensional-anchor";
import { HexType } from "ttpg-darrell";

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
  const hero = new HeroDimensionalAnchor();
  const hexes: Set<HexType> = hero._getDimensionalTearHexes(true);
  expect(hexes.size).toBeGreaterThan(0);
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
