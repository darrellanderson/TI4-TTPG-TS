import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";
import { UpdatorActiveSystem } from "../updator-active-system/updator-active-system";

export const GAME_DATA_UPDATORS: Array<IGameDataUpdator> = [
  new UpdatorActiveSystem(),
];
