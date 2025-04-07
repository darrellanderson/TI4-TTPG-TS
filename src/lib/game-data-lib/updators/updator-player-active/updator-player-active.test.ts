import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerActive } from "./updator-player-active";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerActive;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});
