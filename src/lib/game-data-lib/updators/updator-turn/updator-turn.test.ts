import { PlayerSlot } from "ttpg-darrell";
import { MockCardHolder } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorTurn } from "./udpator-turn";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorTurn;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorTurn().update(gameData);
  expect(gameData.turn).toEqual("green");
});
