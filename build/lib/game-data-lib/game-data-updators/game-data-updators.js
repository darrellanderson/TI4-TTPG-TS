"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_DATA_UPDATORS = void 0;
const updator_active_system_1 = require("../updators/updator-active-system/updator-active-system");
const updator_config_1 = require("../updators/updator-config/updator-config");
const updator_hex_summary_1 = require("../updators/updator-hex-summary/updator-hex-summary");
const updator_history_1 = require("../updators/updator-history/updator-history");
const updator_laws_1 = require("../updators/updator-laws/updator-laws");
const updator_map_string_1 = require("../updators/updator-map-string/updator-map-string");
const updator_objectives_1 = require("../updators/updator-objectives/updator-objectives");
const updator_objectives_progress_1 = require("../updators/updator-objectives-progress/updator-objectives-progress");
const updator_round_1 = require("../updators/updator-round/updator-round");
const updator_scoreboard_1 = require("../updators/updator-scoreboard/updator-scoreboard");
const updator_setup_timestamp_1 = require("../updators/updator-setup-timestamp/updator-setup-timestamp");
const updator_speaker_1 = require("../updators/updator-speaker/updator-speaker");
const updator_timer_1 = require("../updators/updator-timer/updator-timer");
const updator_timestamp_1 = require("../updators/updator-timestamp/updator-timestamp");
const udpator_turn_1 = require("../updators/updator-turn/udpator-turn");
const updator_player_active_1 = require("../updators/updator-player-active/updator-player-active");
const updator_player_color_1 = require("../updators/updator-player-color/updator-player-color");
const updator_player_command_tokens_1 = require("../updators/updator-player-command-tokens/updator-player-command-tokens");
const updator_player_custodians_points_1 = require("../updators/updator-player-custodians-points/updator-player-custodians-points");
const updator_player_faction_1 = require("../updators/updator-player-faction/updator-player-faction");
const updator_player_hand_summary_1 = require("../updators/updator-player-hand-summary/updator-player-hand-summary");
const updator_player_leaders_1 = require("../updators/updator-player-leaders/updator-player-leaders");
const updator_player_name_1 = require("../updators/updator-player-name/updator-player-name");
const updator_player_planet_totals_1 = require("../updators/updator-player-planet-totals/updator-player-planet-totals");
const updator_player_score_1 = require("../updators/updator-player-score/updator-player-score");
const updator_player_strategy_cards_1 = require("../updators/updator-player-strategy-cards/updator-player-strategy-cards");
const updator_player_tech_1 = require("../updators/updator-player-tech/updator-player-tech");
const updator_player_tradegoods_1 = require("../updators/updator-player-tradegoods/updator-player-tradegoods");
const updator_player_turn_order_1 = require("../updators/updator-player-turn-order/updator-player-turn-order");
exports.GAME_DATA_UPDATORS = [
    new updator_active_system_1.UpdatorActiveSystem(),
    new updator_config_1.UpdatorConfig(),
    new updator_hex_summary_1.UpdatorHexSummary(),
    new updator_history_1.UpdatorHistory(),
    new updator_laws_1.UpdatorLaws(),
    new updator_map_string_1.UpdatorMapString(),
    new updator_objectives_1.UpdatorObjectives(),
    new updator_objectives_progress_1.UpdatorObjectivesProgress(),
    new updator_round_1.UpdatorRound(),
    new updator_scoreboard_1.UpdatorScoreboard(),
    new updator_setup_timestamp_1.UpdatorSetupTimestamp(),
    new updator_speaker_1.UpdatorSpeaker(),
    new updator_timer_1.UpdatorTimer(),
    new updator_timestamp_1.UpdatorTimestamp(),
    new udpator_turn_1.UpdatorTurn(),
    // Per-player updators.
    new updator_player_active_1.UpdatorPlayerActive(),
    new updator_player_color_1.UpdatorPlayerColor(),
    new updator_player_command_tokens_1.UpdatorPlayerCommandTokens(),
    new updator_player_custodians_points_1.UpdatorPlayerCustodiansPoints(),
    new updator_player_faction_1.UpdatorPlayerFaction(),
    new updator_player_hand_summary_1.UpdatorPlayerHandSummary(),
    new updator_player_leaders_1.UpdatorPlayerLeaders(),
    new updator_player_name_1.UpdatorPlayerName(),
    new updator_player_planet_totals_1.UpdatorPlayerPlanetTotals(),
    new updator_player_score_1.UpdatorPlayerScore(),
    new updator_player_strategy_cards_1.UpdatorPlayerStrategyCards(),
    new updator_player_tech_1.UpdatorPlayerTech(),
    new updator_player_tradegoods_1.UpdatorPlayerTradegoods(),
    new updator_player_turn_order_1.UpdatorPlayerTurnOrder(),
];
//# sourceMappingURL=game-data-updators.js.map