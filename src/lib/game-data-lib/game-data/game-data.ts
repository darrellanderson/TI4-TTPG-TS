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
};
