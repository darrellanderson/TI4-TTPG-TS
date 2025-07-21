"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TI4Class = void 0;
exports.registerErrorHandler = registerErrorHandler;
exports.resetGlobalThisTI4 = resetGlobalThisTI4;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const activate_system_1 = require("../context-menu/system/activate-system/activate-system");
const agenda_activity_start_1 = require("../lib/agenda-lib/agenda-activity-start/agenda-activity-start");
const all_borders_1 = require("../lib/border-lib/all-borders/all-borders");
const auto_streamer_camera_1 = require("../lib/streamer-lib/auto-streamer-camera/auto-streamer-camera");
const config_1 = require("../lib/config/config");
const control_token_system_1 = require("../context-menu/system/control-token-system/control-token-system");
const create_and_attach_end_turn_button_ui_1 = require("../ui/end-turn-button-ui/create-and-attach-end-turn-button-ui");
const create_and_attach_turn_order_ui_1 = require("../ui/turn-order-ui/create-and-attach-turn-order-ui");
const diplomacy_system_1 = require("../context-menu/system/diplomacy-system/diplomacy-system");
const display_pds_adjacency_1 = require("../context-menu/display-pds-adjacency/display-pds-adjacency");
const draft_activity_start_1 = require("../lib/draft-lib/draft-activity-start/draft-activity-start");
const faction_registry_1 = require("../lib/faction-lib/registry/faction-registry");
const game_data_export_1 = require("../lib/game-data-lib/game-data-export/game-data-export");
const game_data_updator_1 = require("../lib/game-data-lib/game-data-updator/game-data-updator");
const game_data_updators_1 = require("../lib/game-data-lib/game-data-updators/game-data-updators");
const global_events_1 = require("./global-events");
const goal_reporter_1 = require("../lib/game-data-lib/objective-progress/goal-reporter");
const hide_mouse_cursor_1 = require("../lib/streamer-lib/hide-mouse-cursor/hide-mouse-cursor");
const homebrew_registry_1 = require("../lib/homebrew-lib/homebrew-registry/homebrew-registry");
const last_game_data_1 = require("../lib/game-data-lib/last-game-data/last-game-data");
const numpad_key_all_1 = require("../lib/numpad-key-lib/numpad-key-all/numpad-key-all");
const on_agenda_card_1 = require("../event/on-agenda-card/on-agenda-card");
const on_chat_message_1 = require("../event/on-chat-message/on-chat-message");
const on_combat_clicked_1 = require("../event/on-combat-clicked/on-combat-clicked");
const on_combat_result_1 = require("../event/on-combat-result/on-combat-result");
const on_game_end_1 = require("../event/on-game-end/on-game-end");
const on_object_fell_through_table_1 = require("../event/on-object-fell-through-table/on-object-fell-through-table");
const on_player_change_color_request_1 = require("../event/on-player-change-color-request/on-player-change-color-request");
const on_player_changed_color_1 = require("../event/on-player-changed-color/on-player-changed-color");
const on_slice_draft_request_1 = require("../event/on-slice-draft-request/on-slice-draft-request");
const on_strategy_card_played_1 = require("../event/on-strategy-card-played/on-strategy-card-played");
const on_system_activated_1 = require("../event/on-system-activated/on-system-activated");
const on_turn_state_changed_1 = require("../event/on-turn-state-changed/on-turn-state-changed");
const on_whisper_1 = require("../event/on-whisper/on-whisper");
const planet_attachment_registry_1 = require("../lib/system-lib/registry/planet-attachment-registry");
const player_action_phase_time_1 = require("../lib/player-lib/player-action-phase-time/player-action-phase-time");
const player_color_1 = require("../lib/player-lib/player-color/player-color");
const player_name_1 = require("../lib/player-lib/player-name/player-name");
const player_seats_1 = require("../lib/player-lib/player-seats/player-seats");
const remove_registry_1 = require("../lib/remove-lib/registry/remove-registry");
const report_command_token_put_get_1 = require("../lib/command-token-lib/report-command-token-put-get/report-command-token-put-get");
const report_remaining_1 = require("../context-menu/report-remaining/report-remaining");
const right_click_agenda_1 = require("../context-menu/right-click-agenda/right-click-agenda");
const right_click_delete_1 = require("../context-menu/right-click-delete/right-click-delete");
const right_click_explore_1 = require("../context-menu/system/explore-system/right-click-explore");
const right_click_iihq_modernization_1 = require("../context-menu/cards/iihq-modernization/right-click-iihq-modernization");
const right_click_infantry_2_1 = require("../context-menu/cards/infantry-2/right-click-infantry-2");
const right_click_letani_warrior_2_1 = require("../context-menu/cards/infantry-2/right-click-letani-warrior-2");
const right_click_maban_omega_1 = require("../context-menu/cards/maban-omega/right-click-maban-omega");
const right_click_maban_omega_alliance_1 = require("../context-menu/cards/maban-omega/right-click-maban-omega-alliance");
const right_click_mageon_implants_1 = require("../context-menu/cards/mageon-implants/right-click-mageon-implants");
const right_click_nano_forge_1 = require("../context-menu/cards/nano-forge/right-click-nano-forge");
const right_click_purge_1 = require("../context-menu/right-click-purge/right-click-purge");
const right_click_rider_1 = require("../context-menu/right-click-rider/right-click-rider");
const right_click_rift_1 = require("../context-menu/right-click-rift/right-click-rift");
const right_click_score_private_1 = require("../context-menu/right-click-score/right-click-score-private");
const right_click_score_public_1 = require("../context-menu/right-click-score/right-click-score-public");
const right_click_spec_ops_2_1 = require("../context-menu/cards/infantry-2/right-click-spec-ops-2");
const right_click_stellar_converter_1 = require("../context-menu/cards/stellar-converter/right-click-stellar-converter");
const run_inject_script_1 = require("../lib/homebrew-lib/run-inject-script/run-inject-script");
const r_swap_split_combine_1 = require("./r-swap-split-combine");
const shuffle_decks_1 = require("./shuffle-decks");
const slash_command_registry_1 = require("../lib/slash-command-lib/slash-command-registry/slash-command-registry");
const start_game_1 = require("../lib/start-game-lib/start-game");
const start_game_window_1 = require("../lib/start-game-lib/start-game-window");
const system_attachment_registry_1 = require("../lib/system-lib/registry/system-attachment-registry");
const system_registry_1 = require("../lib/system-lib/registry/system-registry");
const tech_registry_1 = require("../lib/tech-lib/registry/tech-registry");
const toggle_action_phase_times_1 = require("../context-menu/toggle-action-phase-times/toggle-action-phase-times");
const toggle_all_players_tech_1 = require("../context-menu/toggle-all-players-tech/toggle-all-players-tech");
const toggle_borders_1 = require("../context-menu/toggle-borders/toggle-borders");
const toggle_combat_window_1 = require("../context-menu/toggle-combat-window/toggle-combat-window");
const toggle_help_1 = require("../context-menu/toggle-help/toggle-help");
const toggle_map_tool_1 = require("../context-menu/toggle-map-tool/toggle-map-tool");
const toggle_stats_1 = require("../context-menu/toggle-stats/toggle-stats");
const toggle_strat_cards_1 = require("../context-menu/toggle-strat-cards/toggle-strat-cards");
const toggle_streamer_tool_1 = require("../context-menu/toggle-streamer-tool/toggle-streamer-tool");
const toggle_tech_chooser_1 = require("../context-menu/toggle-tech-chooser/toggle-tech-chooser");
const unit_attrs_registry_1 = require("../lib/unit-lib/registry/unit-attrs-registry");
const unit_modifier_active_idle_1 = require("../lib/unit-lib/unit-modifier/unit-modifier-active-idle");
const unit_modifier_registry_1 = require("../lib/unit-lib/registry/unit-modifier-registry");
const unpack_faction_1 = require("../context-menu/unpack-faction/unpack-faction");
const updator_history_1 = require("../lib/game-data-lib/updators/updator-history/updator-history");
const use_streamer_buddy_1 = require("../lib/streamer-lib/use-streamer-buddy/use-streamer-buddy");
const whisper_spy_1 = require("../lib/streamer-lib/whisper-spy/whisper-spy");
// Events
const right_click_age_of_exploration_1 = require("../context-menu/events/age-of-exploration/right-click-age-of-exploration");
const right_click_minor_factions_1 = require("../context-menu/events/minor-factions/right-click-minor-factions");
const locale_context_menus_1 = require("../locale/locale-context-menus");
const nsid_to_template_id_1 = require("../nsid/nsid-to-template-id");
ttpg_darrell_1.Spawn.inject(nsid_to_template_id_1.NSID_TO_TEMPLATE_ID);
ttpg_darrell_1.Find.ignoreOwnedCardHolderNsid("card-holder:base/player-scoring");
function registerErrorHandler() {
    if (api_1.GameWorld.getExecutionReason() !== "unittest") {
        console.log("--- Welcome to TI4 ---");
        // Initialize error handing when running in production.
        new ttpg_darrell_1.ErrorHandler().init();
        new ttpg_darrell_1.BugSplatRemoteReporter({
            database: "da_test",
            appName: "TI4-TTPG-TS",
            appVersion: "1",
        }).init();
    }
}
registerErrorHandler();
class TI4Class {
    constructor() {
        // Strings.
        this.locale = ttpg_darrell_1.locale;
        // Events.
        this.events = Object.freeze(new global_events_1.GlobalEvents());
        // Libraries.
        this.autoStreamerCamera = new auto_streamer_camera_1.AutoStreamerCamera("@auto-streamer-camera/ti4");
        this.borders = new all_borders_1.AllBorders();
        this.config = new config_1.Config("@config/ti4");
        this.hex = new ttpg_darrell_1.Hex(ttpg_darrell_1.HEX_LAYOUT_POINTY, 5.77735 * 1.5);
        this.factionRegistry = new faction_registry_1.FactionRegistry()
            .loadDefaultData()
            .loadDefaultRewriteNsid();
        this.gameDataUpdator = new game_data_updator_1.GameDataUpdator(game_data_updators_1.GAME_DATA_UPDATORS).startPeriodicUpdatesInProduction();
        this.goalReporter = new goal_reporter_1.GoalReporter();
        this.hideMouseCursor = new hide_mouse_cursor_1.HideMouseCursor("@hide-mouse-cursor/ti4");
        this.homebrewRegistry = new homebrew_registry_1.HomebrewRegistry();
        this.lastGameData = new last_game_data_1.LastGameData();
        this.planetAttachmentRegistry = new planet_attachment_registry_1.PlanetAttachmentRegistry().loadDefaultData();
        this.playerActionPhaseTime = new player_action_phase_time_1.PlayerActionPhaseTime("@player-action-phase-time/ti4");
        this.playerColor = new player_color_1.PlayerColor("@player-color/ti4");
        this.playerName = new player_name_1.PlayerName();
        this.playerSeats = new player_seats_1.PlayerSeats();
        this.removeRegistry = new remove_registry_1.RemoveRegistry().loadDefaultData();
        this.slashCommandRegistry = new slash_command_registry_1.SlashCommandRegistry().loadDefaultData();
        this.systemAttachmentRegistry = new system_attachment_registry_1.SystemAttachmentRegistry().loadDefaultData();
        this.systemRegistry = new system_registry_1.SystemRegistry().loadDefaultData();
        this.techRegistry = new tech_registry_1.TechRegistry().loadDefaultData();
        this.timer = new ttpg_darrell_1.Timer("@timer/ti4");
        this.turnOrder = new ttpg_darrell_1.TurnOrder("@turn-order/ti4");
        this.unitAttrsRegistry = new unit_attrs_registry_1.UnitAttrsRegistry().loadDefaultData();
        this.unitModifierRegistry = new unit_modifier_registry_1.UnitModifierRegistry().loadDefaultData();
        this.useStreamerBuddy = new use_streamer_buddy_1.UseStreamerBuddy("@use-streamer-buddy/ti4");
        this.whisperSpy = new whisper_spy_1.WhisperSpy("@whisper-spy/ti4");
    }
}
exports.TI4Class = TI4Class;
// Expose a reset function so tests can reset.
// ttpg-mock resets globalEvents after each test, breaking listeners here.
function resetGlobalThisTI4() {
    globalThis.TI4 = new TI4Class();
    Object.freeze(globalThis.TI4);
    TI4.locale.inject(locale_context_menus_1.LOCALE_CONTENT_MENUS);
    // Run any delayed initialization, things that need globalThis.TI4 to be set.
    // These are "init" functions in the class objects.
    const iGlobals = [
        new activate_system_1.ActivateSystem(),
        new control_token_system_1.ControlTokenSystem(),
        new ttpg_darrell_1.DiceGroupCleanup(),
        new diplomacy_system_1.DiplomacySystem(),
        new display_pds_adjacency_1.DisplayPDSAdjacency(),
        new game_data_export_1.GameDataExport(),
        new ttpg_darrell_1.LeaveSeat(),
        new numpad_key_all_1.NumpadKeyAll(),
        new on_agenda_card_1.OnAgendaCard(),
        new ttpg_darrell_1.OnCardBecameSingletonOrDeck(),
        new on_chat_message_1.OnChatMessage(),
        new on_combat_clicked_1.OnCombatClicked(),
        new on_combat_result_1.OnCombatResult(),
        new on_game_end_1.OnGameEnd(),
        new on_object_fell_through_table_1.OnObjectFellThroughTable().setRelocateTo(new api_1.Vector(0, -250, 0)),
        new on_player_change_color_request_1.OnPlayerChangeColorRequest(),
        new on_player_changed_color_1.OnPlayerChangedColor(),
        new on_slice_draft_request_1.OnSliceDraftRequest(),
        new on_strategy_card_played_1.OnStrategyCardPlayed(),
        new on_system_activated_1.OnSystemActivated(),
        new on_turn_state_changed_1.OnTurnStateChanged(),
        new on_whisper_1.OnWhisper(),
        new report_command_token_put_get_1.ReportCommandTokenPutGet(),
        new report_remaining_1.ReportRemaining(),
        new right_click_agenda_1.RightClickAgenda(),
        new right_click_explore_1.RightClickExplore(),
        new right_click_iihq_modernization_1.RightClickIihqModernization(),
        new right_click_infantry_2_1.RightClickInfantry2(),
        new right_click_letani_warrior_2_1.RightClickLetaniWarrior2(),
        new right_click_maban_omega_1.RightClickMabanOmega(),
        new right_click_maban_omega_alliance_1.RightClickMabanOmegaAlliance(),
        new right_click_mageon_implants_1.RightClickMageonImplants(),
        new right_click_nano_forge_1.RightClickNanoForge(),
        new right_click_purge_1.RightClickPurge(),
        new right_click_rider_1.RightClickRider(),
        new right_click_rift_1.RightClickRift(),
        new right_click_score_private_1.RightClickScorePrivate(),
        new right_click_score_public_1.RightClickScorePublic(),
        new right_click_spec_ops_2_1.RightClickSpecOps2(),
        new right_click_stellar_converter_1.RightClickStellarConverter(),
        new run_inject_script_1.RunInjectScript(),
        new r_swap_split_combine_1.RSwapSplitCombine(),
        new shuffle_decks_1.ShuffleDecks(),
        new start_game_1.StartGame(),
        new start_game_window_1.StartGameWindow(),
        new toggle_action_phase_times_1.ToggleActionPhaseTimes(),
        new toggle_all_players_tech_1.ToggleAllPlayersTech(),
        new toggle_borders_1.ToggleBorders(),
        new toggle_combat_window_1.ToggleCombatWindow(),
        new toggle_help_1.ToggleHelp(),
        new toggle_map_tool_1.ToggleMapTool(),
        new toggle_stats_1.ToggleStats(),
        new toggle_strat_cards_1.ToggleStratCards(),
        new toggle_streamer_tool_1.ToggleStreamerTool(),
        new toggle_tech_chooser_1.ToggleTechChooser(),
        new unit_modifier_active_idle_1.UnitModifierActiveIdle(),
        new unpack_faction_1.UnpackFactionContextMenuItem(),
        new ttpg_darrell_1.WhisperReporter(),
        // Events.
        new right_click_age_of_exploration_1.RightClickAgeOfExploration(),
        new right_click_minor_factions_1.RightClickMinorFactions(),
        // Do these last to be below "real" right click options.
        new right_click_delete_1.RightClickDelete(),
    ];
    // Add UI and some bug workarounds to production runs.
    if (api_1.GameWorld.getExecutionReason() !== "unittest") {
        iGlobals.push(...[
            new ttpg_darrell_1.BugCardHolderAssignment("card-holder:base/player-hand"),
            //new BugForceTransformUpdates(),
            new ttpg_darrell_1.BugUniqueCards(),
            new create_and_attach_end_turn_button_ui_1.CreateAndAttachEndTurnButtonUI(),
            new create_and_attach_turn_order_ui_1.CreateAndAttachTurnOrderUI(),
        ]);
    }
    // Some game data updators need IGlobal.  This is a hack.
    for (const updator of game_data_updators_1.GAME_DATA_UPDATORS) {
        if (updator instanceof updator_history_1.UpdatorHistory) {
            iGlobals.push(updator);
        }
    }
    // Finally run any "after everything else" init functions.
    iGlobals.push(...[new agenda_activity_start_1.AgendaActivityMaybeResume(), new draft_activity_start_1.DraftActivityMaybeResume()]);
    for (const v of Object.values(globalThis.TI4)) {
        if (typeof v.init === "function") {
            iGlobals.push(v);
        }
    }
    ttpg_darrell_1.GlobalInit.runGlobalInit(iGlobals);
    return globalThis.TI4;
}
// Unittests reset the globalThis.TI4 object before each test.
if (api_1.GameWorld.getExecutionReason() !== "unittest") {
    resetGlobalThisTI4();
    TI4.config.onConfigChanged.add(() => {
        ttpg_darrell_1.BugSplatRemoteReporter.setEnabled(TI4.config.reportErrors);
    });
    ttpg_darrell_1.BugSplatRemoteReporter.setEnabled(TI4.config.reportErrors);
}
api_1.world.setShowDiceRollMessages(false); // Disable default TTPG messages for dice rolls.
//# sourceMappingURL=global.js.map