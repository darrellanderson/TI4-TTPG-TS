import { Card } from "@tabletop-playground/api";
import { ResetPlanetCards } from "./reset-planet-cards";
import { MockCard, MockGameObject } from "ttpg-mock";
import { Facing } from "ttpg-darrell";

it("constructor", () => {
  new ResetPlanetCards();
});

it("reset", () => {
  const looseCard: Card = MockCard.simple("card.planet:base/industrial-planet");
  looseCard.flipOrUpright();
  expect(Facing.isFaceUp(looseCard)).toBe(false);

  new ResetPlanetCards().reset();
  expect(Facing.isFaceUp(looseCard)).toBe(true);
});

it("reset (planet on system tile)", () => {
  MockGameObject.simple("tile.system:base/1");
  expect(TI4.systemRegistry.getAllSystemsWithObjs().length).toBe(1);

  const looseCard: Card = MockCard.simple("card.planet:base/industrial-planet");
  looseCard.flipOrUpright();
  expect(Facing.isFaceUp(looseCard)).toBe(false);

  new ResetPlanetCards().reset();
  expect(Facing.isFaceUp(looseCard)).toBe(false); // on system tile
});
