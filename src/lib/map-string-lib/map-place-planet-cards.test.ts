import { MockGameObject } from "ttpg-mock";
import { MapPlacePlanetCards } from "./map-place-planet-cards";

it("static getAllPlanets", () => {
  MockGameObject.simple("tile.system:base/18");
  const planets = MapPlacePlanetCards.getAllPlanets();
  expect(planets.length).toBe(1);
});

it("constructor", () => {
  new MapPlacePlanetCards();
});
