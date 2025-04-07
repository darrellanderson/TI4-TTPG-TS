import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";
import { UpdatorActiveSystem } from "../updators/updator-active-system/updator-active-system";
import { UpdatorPlayerActive } from "../updators/updator-player-active/updator-player-active";
import { UpdatorPlayerColor } from "../updators/updator-player-color/updator-player-color";
import { UpdatorPlayerName } from "../updators/updator-player-name/updator-player-name";
import { UpdatorPlayerScore } from "../updators/updator-player-score/updator-player-score";

export const GAME_DATA_UPDATORS: Array<IGameDataUpdator> = [
  new UpdatorActiveSystem(),
  new UpdatorPlayerActive(),
  new UpdatorPlayerColor(),
  new UpdatorPlayerName(),
  new UpdatorPlayerScore(),
];
