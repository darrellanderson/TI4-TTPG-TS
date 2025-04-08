import { UpdatorConfigType } from "../updators/updator-config/updator-config-type";
import { UpdatorActiveSystemType } from "../updators/updator-active-system/updator-active-system-type";

export type PerPlayerGameData = {
  active?: boolean;
  color?: string;
  name?: string;
  score?: number;
};

/**
 * JSON-serializable game data (NOT a class).
 */
export type GameData = {
  players: Array<PerPlayerGameData>;

  activeSystem?: UpdatorActiveSystemType;
  config?: UpdatorConfigType;
  scoreboard?: number; // game to 10/14 points
  setupTimestamp?: number; // epoch time (seconds)
};
