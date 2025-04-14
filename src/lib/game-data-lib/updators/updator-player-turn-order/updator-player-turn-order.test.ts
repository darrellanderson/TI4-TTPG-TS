import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerTurnOrder } from "./updator-player-turn-order";
import { GameData } from "../../game-data/game-data";
import { PlayerSlot } from "ttpg-darrell";
import { MockCardHolder } from "ttpg-mock";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerTurnOrder;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });

  const order: Array<PlayerSlot> = [10, 11];
  TI4.turnOrder.setTurnOrder(order, "forward", 10);
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTurnOrder().update(gameData);
  expect(gameData).toEqual({
    players: [{ turnOrder: 0 }, { turnOrder: 1 }, {}, {}, {}, {}],
  });
});
