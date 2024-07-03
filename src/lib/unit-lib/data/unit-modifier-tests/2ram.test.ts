import { placeGameObjects } from "./abstract.test";

it("2ram", () => {
  placeGameObjects({
    self: ["card.commander:pok/2ram"],
    selfUnits: new Map([["dreadnought", 1]]),
  });
});
