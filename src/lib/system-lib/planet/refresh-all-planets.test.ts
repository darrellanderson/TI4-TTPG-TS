import { MockCard, MockGameObject } from "ttpg-mock";
import { RefreshAllPlanets } from "./refresh-all-planets";
import { Card, GameObject } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";

it("_getSystemHexes", () => {
  MockGameObject.simple("tile.system:base/18");

  const refreshAllPlanets = new RefreshAllPlanets();
  const systemHexes = refreshAllPlanets._getSystemHexes();
  expect(systemHexes.size).toBe(1);
  expect(systemHexes.has("<0,0,0>")).toBe(true);
});

it("refresh", () => {
  MockGameObject.simple("tile.system:base/18");
  const onSystemCard: Card = MockCard.simple("card.planet:base/mecatol-rex", {
    isFaceUp: false,
  });
  const offSystemCard: Card = MockCard.simple("card.planet:base/jord", {
    position: [0, 10, 0],
    isFaceUp: false,
  });
  const onSystemUnit: GameObject = MockGameObject.simple("unit:base/infantry", {
    rotation: [0, 0, 180],
  });
  const offSystemUnit: GameObject = MockGameObject.simple(
    "unit:base/infantry",
    { position: [0, 10, 0], rotation: [0, 0, 180] }
  );

  expect(onSystemCard.isFaceUp()).toBe(false);
  expect(offSystemCard.isFaceUp()).toBe(false);
  expect(Facing.isFaceUp(onSystemUnit)).toBe(false);
  expect(Facing.isFaceUp(offSystemUnit)).toBe(false);

  const refreshAllPlanets = new RefreshAllPlanets();
  refreshAllPlanets.refresh(true);

  expect(onSystemCard.isFaceUp()).toBe(false);
  expect(offSystemCard.isFaceUp()).toBe(true);
  expect(Facing.isFaceUp(onSystemUnit)).toBe(true);
  expect(Facing.isFaceUp(offSystemUnit)).toBe(true);
});
