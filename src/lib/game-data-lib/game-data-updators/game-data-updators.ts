import { IGameDataUpdator } from "../i-game-data-updator/i-game-data-updator";

import { UpdatorActiveSystem } from "../updators/updator-active-system/updator-active-system";
import { UpdatorConfig } from "../updators/updator-config/updator-config";
import { UpdatorGalacticEvents } from "../updators/updator-galactic-events/updator-galactic-events";
import { UpdatorHexSummary } from "../updators/updator-hex-summary/updator-hex-summary";
import { UpdatorHistory } from "../updators/updator-history/updator-history";
import { UpdatorLaws } from "../updators/updator-laws/updator-laws";
import { UpdatorMapString } from "../updators/updator-map-string/updator-map-string";
import { UpdatorObjectives } from "../updators/updator-objectives/updator-objectives";
import { UpdatorObjectivesProgress } from "../updators/updator-objectives-progress/updator-objectives-progress";
import { UpdatorRound } from "../updators/updator-round/updator-round";
import { UpdatorScoreboard } from "../updators/updator-scoreboard/updator-scoreboard";
import { UpdatorSetupTimestamp } from "../updators/updator-setup-timestamp/updator-setup-timestamp";
import { UpdatorSpeaker } from "../updators/updator-speaker/updator-speaker";
import { UpdatorTimer } from "../updators/updator-timer/updator-timer";
import { UpdatorTimestamp } from "../updators/updator-timestamp/updator-timestamp";
import { UpdatorTurn } from "../updators/updator-turn/udpator-turn";

import { UpdatorPlayerActive } from "../updators/updator-player-active/updator-player-active";
import { UpdatorPlayerAlliances } from "../updators/updator-player-alliances/updator-player-alliances";
import { UpdatorPlayerColor } from "../updators/updator-player-color/updator-player-color";
import { UpdatorPlayerCommandTokens } from "../updators/updator-player-command-tokens/updator-player-command-tokens";
import { UpdatorPlayerCustodiansPoints } from "../updators/updator-player-custodians-points/updator-player-custodians-points";
import { UpdatorPlayerFaction } from "../updators/updator-player-faction/updator-player-faction";
import { UpdatorPlayerHandSummary } from "../updators/updator-player-hand-summary/updator-player-hand-summary";
import { UpdatorPlayerLeaders } from "../updators/updator-player-leaders/updator-player-leaders";
import { UpdatorPlayerName } from "../updators/updator-player-name/updator-player-name";
import { UpdatorPlayerPlanetTotals } from "../updators/updator-player-planet-totals/updator-player-planet-totals";
import { UpdatorPlayerScore } from "../updators/updator-player-score/updator-player-score";
import { UpdatorPlayerStrategyCards } from "../updators/updator-player-strategy-cards/updator-player-strategy-cards";
import { UpdatorPlayerTech } from "../updators/updator-player-tech/updator-player-tech";
import { UpdatorPlayerTradegoods } from "../updators/updator-player-tradegoods/updator-player-tradegoods";
import { UpdatorPlayerTurnOrder } from "../updators/updator-player-turn-order/updator-player-turn-order";

export const GAME_DATA_UPDATORS: Array<IGameDataUpdator> = [
  new UpdatorActiveSystem(),
  new UpdatorConfig(),
  new UpdatorGalacticEvents(),
  new UpdatorHexSummary(),
  new UpdatorHistory(),
  new UpdatorLaws(),
  new UpdatorMapString(),
  new UpdatorObjectives(),
  new UpdatorObjectivesProgress(),
  new UpdatorRound(),
  new UpdatorScoreboard(),
  new UpdatorSetupTimestamp(),
  new UpdatorSpeaker(),
  new UpdatorTimer(),
  new UpdatorTimestamp(),
  new UpdatorTurn(),

  // Per-player updators.
  new UpdatorPlayerActive(),
  new UpdatorPlayerAlliances(),
  new UpdatorPlayerColor(),
  new UpdatorPlayerCommandTokens(),
  new UpdatorPlayerCustodiansPoints(),
  new UpdatorPlayerFaction(),
  new UpdatorPlayerHandSummary(),
  new UpdatorPlayerLeaders(),
  new UpdatorPlayerName(),
  new UpdatorPlayerPlanetTotals(),
  new UpdatorPlayerScore(),
  new UpdatorPlayerStrategyCards(),
  new UpdatorPlayerTech(),
  new UpdatorPlayerTradegoods(),
  new UpdatorPlayerTurnOrder(),
];
