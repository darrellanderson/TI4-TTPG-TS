import { UpdatorActiveSystemType } from "../updators/updator-active-system/updator-active-system-type";
import { UpdatorConfigType } from "../updators/updator-config/updator-config-type";
import { UpdatorObjectivesType } from "../updators/updator-objectives/updator-objectives-type";
import { UpdatorPlayerCommandTokensType } from "../updators/updator-player-command-tokens/updator-player-command-tokens-type";
import { UpdatorPlayerLeadersType } from "../updators/updator-player-leaders/updator-player-leaders-type";
import { UpdatorPlayerHandSummaryType } from "../updators/updator-player-hand-summary/updator-player-hand-summary-type";
import { UpdatorPlayerPlanetTotalsType } from "../updators/updator-player-planet-totals/updator-player-planet-totals-type";
import { UpdatorTimerType } from "../updators/updator-timer/updator-timer-type";

export type PerPlayerGameData = {
  active?: boolean;
  color?: string;
  commandTokens?: UpdatorPlayerCommandTokensType;
  custodiansPoints?: number;
  factionFull?: string; // "The Federation of Sol"
  factionShort?: string; // "Sol"
  handSummary?: UpdatorPlayerHandSummaryType;
  laws?: Array<string>; // card names
  leaders?: UpdatorPlayerLeadersType;
  objectives?: Array<string>; // card names
  planetTotals?: UpdatorPlayerPlanetTotalsType;
  score?: number;
  steamName?: string;
  strategyCards?: Array<string>; // strategy card names
  strategyCardsFaceDown?: Array<string>; // strategy card names
  technologies?: Array<string>; // abbr names
  turnOrder?: number; // index in turn order array

  commodities?: number;
  tradeGoods?: number;
  maxCommodities?: number;
};

/**
 * JSON-serializable game data (NOT a class).
 */
export type GameData = {
  players: Array<PerPlayerGameData>;

  activeSystem?: UpdatorActiveSystemType;
  config?: UpdatorConfigType;
  hexSummary?: string;
  laws?: Array<string>; // card names
  mapString?: string;
  objectives?: UpdatorObjectivesType;
  platform?: string;
  round?: number;
  scoreboard?: number; // game to 10/14 points
  setupTimestamp?: number; // epoch time (seconds)
  speaker?: string; // player color
  timer?: UpdatorTimerType;
  timestamp?: number; // epoch time (seconds)
  turn?: string; // player color
};
