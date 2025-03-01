import { Card } from "@tabletop-playground/api";
import { GarbageContainer } from "ttpg-darrell";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { MapRemovePlanetCards } from "./map-remove-planet-cards";
import { RecycleCardPlanet } from "../../recycle-lib/handlers/card/planet/recycle-card-planet";

it("remove", () => {
  MockGameObject.simple("tile.system:base/18");
  const card: Card = MockCard.simple("card.planet:base/mecatol-rex");
  const _mat = new MockGameObject({
    position: [10, 0, 0],
    snapPoints: [new MockSnapPoint({ tags: ["deck-planet"] })],
  });

  GarbageContainer.addHandler(new RecycleCardPlanet());

  expect(card.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  new MapRemovePlanetCards().removePlanetCards();
  expect(card.getPosition().toString()).toEqual("(X=10,Y=0,Z=0)");
});
