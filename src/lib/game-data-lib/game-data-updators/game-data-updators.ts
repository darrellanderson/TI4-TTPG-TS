import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";

import { UpdatorActiveSystem } from "../updators/updator-active-system/updator-active-system";
import { UpdatorConfig } from "../updators/updator-config/updator-config";
import { UpdatorLaws } from "../updators/updator-laws/updator-laws";
import { UpdatorMapString } from "../updators/updator-map-string/updator-map-string";
import { UpdatorScoreboard } from "../updators/updator-scoreboard/updator-scoreboard";
import { UpdatorSetupTimestamp } from "../updators/updator-setup-timestamp/updator-setup-timestamp";

import { UpdatorPlayerActive } from "../updators/updator-player-active/updator-player-active";
import { UpdatorPlayerColor } from "../updators/updator-player-color/updator-player-color";
import { UpdatorPlayerCommandTokens } from "../updators/updator-player-command-tokens/updator-player-command-tokens";
import { UpdatorPlayerName } from "../updators/updator-player-name/updator-player-name";
import { UpdatorPlayerScore } from "../updators/updator-player-score/updator-player-score";

export const GAME_DATA_UPDATORS: Array<IGameDataUpdator> = [
  new UpdatorActiveSystem(),
  new UpdatorConfig(),
  new UpdatorLaws(),
  new UpdatorMapString(),
  new UpdatorScoreboard(),
  new UpdatorSetupTimestamp(),

  // Per-player updators.
  new UpdatorPlayerActive(),
  new UpdatorPlayerColor(),
  new UpdatorPlayerCommandTokens(),
  new UpdatorPlayerName(),
  new UpdatorPlayerScore(),
];
