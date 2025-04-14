import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorRound } from "./updator-round";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { Card, GameObject } from "@tabletop-playground/api";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorRound;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const card1: Card = MockCard.simple(
    "card.objective.public-1:pok/amass-wealth"
  );
  const card2: Card = MockCard.simple(
    "card.objective.public-2:pok/achieve-supremacy"
  );

  const _mat1: GameObject = new MockGameObject({
    templateMetadata: "mat:base/objective-1",
    snapPoints: [
      new MockSnapPoint({
        tags: ["card-objective-1"],
        snappedObject: card1,
      }),
    ],
  });
  const _mat2: GameObject = new MockGameObject({
    templateMetadata: "mat:base/objective-2",
    snapPoints: [
      new MockSnapPoint({
        tags: ["card-objective-2"],
        snappedObject: card2,
      }),
    ],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorRound().update(gameData);
  expect(gameData.round).toEqual(1);
});
