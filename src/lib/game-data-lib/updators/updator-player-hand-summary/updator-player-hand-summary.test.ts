import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerName } from "../updator-player-name/updator-player-name";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorPlayerHandSummary } from "./updator-player-hand-summary";
import { MockCard, MockCardHolder } from "ttpg-mock";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerName;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    cards: [
      MockCard.simple("card.action:base/a"),
      MockCard.simple("card.action:base/b"),
      MockCard.simple("card.action:base/c"),
      MockCard.simple("card.promissory:base/a"),
      MockCard.simple("card.promissory:base/b"),
      MockCard.simple("card.secret:base/a"),
    ],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerHandSummary().update(gameData);
  expect(gameData).toEqual({
    players: [
      { handSummary: { Actions: 3, Promissory: 2, "Secret Objectives": 1 } },
      { handSummary: { Actions: 0, Promissory: 0, "Secret Objectives": 0 } },
      { handSummary: { Actions: 0, Promissory: 0, "Secret Objectives": 0 } },
      { handSummary: { Actions: 0, Promissory: 0, "Secret Objectives": 0 } },
      { handSummary: { Actions: 0, Promissory: 0, "Secret Objectives": 0 } },
      { handSummary: { Actions: 0, Promissory: 0, "Secret Objectives": 0 } },
    ],
  });
});
