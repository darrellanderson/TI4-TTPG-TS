import { UpdatorActiveSystemType } from "../updator-active-system/updator-active-system-type";

export type PerPlayerGameData = {
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
};
