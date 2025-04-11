import { UpdatorActiveSystemType } from "../updators/updator-active-system/updator-active-system-type";
import { UpdatorConfigType } from "../updators/updator-config/updator-config-type";
import { UpdatorObjectivesType } from "../updators/updator-objectives/updator-objectives-type";
import { UpdatorPlayerCommandTokensType } from "../updators/updator-player-command-tokens/updator-player-command-tokens-type";

export type PerPlayerGameData = {
  active?: boolean;
  color?: string;
  commandTokens?: UpdatorPlayerCommandTokensType;
  custodiansPoints?: number;
  laws?: Array<string>; // card names
  name?: string;
  objectives?: Array<string>; // card names
  score?: number;
};

/**
 * JSON-serializable game data (NOT a class).
 */
export type GameData = {
  players: Array<PerPlayerGameData>;

  activeSystem?: UpdatorActiveSystemType;
  config?: UpdatorConfigType;
  // hexSummary?: string
  laws?: Array<string>; // card names
  mapString?: string;
  objectives?: UpdatorObjectivesType;
  scoreboard?: number; // game to 10/14 points
  setupTimestamp?: number; // epoch time (seconds)
};
