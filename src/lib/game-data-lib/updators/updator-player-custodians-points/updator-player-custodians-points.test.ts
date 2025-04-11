import { Atop } from "ttpg-darrell";
import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerActive } from "../updator-player-active/updator-player-active";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorPlayerCustodiansPoints } from "./updator-player-custodians-points";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerActive;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  expect(TI4.playerSeats.getPlayerSlotBySeatIndex(0)).toEqual(10);

  const custodiansToken = MockGameObject.simple("token:base/custodians");
  const controlToken = MockGameObject.simple("token.control:base/sol", {
    owningPlayerSlot: 10,
  });
  expect(controlToken.getOwningPlayerSlot()).toEqual(10);
  expect(new Atop(custodiansToken).isAtop(controlToken.getPosition())).toEqual(
    true
  );
  const _controlToken2 = MockGameObject.simple("token.control:base/sol", {
    owningPlayerSlot: 10,
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerCustodiansPoints().update(gameData);
  expect(gameData).toEqual({
    players: [
      { custodiansPoints: 2 },
      { custodiansPoints: 0 },
      { custodiansPoints: 0 },
      { custodiansPoints: 0 },
      { custodiansPoints: 0 },
      { custodiansPoints: 0 },
    ],
  });
});
