import { MockCard, MockCardDetails } from "ttpg-mock";
import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorGalacticEvents } from "./updator-galactic-events";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorGalacticEvents;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data (empty)", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorGalacticEvents().update(gameData);
  expect(gameData.galacticEvents).toEqual([]);
});

it("data (found)", () => {
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        name: "My Event",
        metadata: "card.event:my-source/my-event",
      }),
    ],
    isFaceUp: true,
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorGalacticEvents().update(gameData);
  expect(gameData.galacticEvents).toEqual(["My Event"]);
});
