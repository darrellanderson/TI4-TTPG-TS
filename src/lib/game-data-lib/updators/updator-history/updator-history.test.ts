import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { UpdatorHistory } from "./updator-history";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { GameData } from "../../game-data/game-data";
import { GameObject } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorHistory;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  expect(TI4.playerSeats.getPlayerSlotBySeatIndex(0)).toEqual(10);

  const updator: IGameDataUpdator = new UpdatorHistory();

  MockGameObject.simple("token:base/scoreboard");
  const nsid: string = "token:base/scoreboard";
  const owningPlayerSlot: number | undefined = undefined;
  const skipContained: boolean = true;
  const scoreboard: GameObject | undefined = new Find().findGameObject(
    nsid,
    owningPlayerSlot,
    skipContained
  );
  expect(scoreboard).toBeDefined();

  TI4.events.onGameData.trigger({
    players: [{ color: "white", score: 3 }],
    round: 1,
  });
  TI4.events.onGameData.trigger({
    players: [{ color: "white", score: 4 }],
    round: 2,
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  updator.update(gameData);
  expect(gameData.history).toEqual([
    { players: [{ color: "white", score: 3 }] },
    { players: [{ color: "white", score: 4 }] },
  ]);
});
