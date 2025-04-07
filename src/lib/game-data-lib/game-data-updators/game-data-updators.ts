import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";
import { UpdatorActiveSystem } from "../updator-active-system/updator-active-system";
import { UpdatorPlayerColor } from "../updator-player-color/updator-player-color";
import { UpdatorPlayerName } from "../updator-player-name/updator-player-name";

export const GAME_DATA_UPDATORS: Array<IGameDataUpdator> = [
  new UpdatorActiveSystem(),
  new UpdatorPlayerColor(),
  new UpdatorPlayerName(),
];
