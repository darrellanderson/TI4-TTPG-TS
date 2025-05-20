import { MockCard, MockGameObject } from "ttpg-mock";
import { RefreshAllPlanets } from "./refresh-all-planets";
import { Card } from "@tabletop-playground/api";

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

  expect(onSystemCard.isFaceUp()).toBe(false);
  expect(offSystemCard.isFaceUp()).toBe(false);

  const refreshAllPlanets = new RefreshAllPlanets();
  refreshAllPlanets.refresh();

  expect(onSystemCard.isFaceUp()).toBe(false);
  expect(offSystemCard.isFaceUp()).toBe(true);
});
