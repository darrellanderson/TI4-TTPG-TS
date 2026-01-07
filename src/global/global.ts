import { GameWorld, refPackageId, world } from "@tabletop-playground/api";
import {
  BugCardHolderAssignment,
  BugSplatRemoteReporter,
  BugUniqueCards,
  DiceGroupCleanup,
  ErrorHandler,
  Find,
  FindTracking,
  GlobalInit,
  Hex,
  HEX_LAYOUT_POINTY, // TTPG inverts x/y axis
  IGlobal,
  LeaveSeat,
  locale,
  OnCardBecameSingletonOrDeck,
  Spawn,
  Timer,
  TurnOrder,
  WhisperReporter,
} from "ttpg-darrell";

import { ActivateSystem } from "../context-menu/system/activate-system/activate-system";
import { AgendaActivityMaybeResume } from "../lib/agenda-lib/agenda-activity-start/agenda-activity-start";
import { AllBorders } from "../lib/border-lib/all-borders/all-borders";
import { ApplyLocaleDescriptions } from "../locale/locale-descriptions";
import { AutoStreamerCamera } from "../lib/streamer-lib/auto-streamer-camera/auto-streamer-camera";
import { Config } from "../lib/config/config";
import { ControlTokenSystem } from "../context-menu/system/control-token-system/control-token-system";
import { CreateAndAttachEndTurnButtonUI } from "../ui/end-turn-button-ui/create-and-attach-end-turn-button-ui";
import { CreateAndAttachTurnOrderUI } from "../ui/turn-order-ui/create-and-attach-turn-order-ui";
import { DiplomacySystem } from "../context-menu/system/diplomacy-system/diplomacy-system";
//import { DisplayPDSAdjacency } from "../context-menu/display-pds-adjacency/display-pds-adjacency";
import { DraftActivityMaybeResume } from "../lib/draft-lib/draft-activity-start/draft-activity-start";
import { FactionRegistry } from "../lib/faction-lib/registry/faction-registry";
import { GameDataExport } from "../lib/game-data-lib/game-data-export/game-data-export";
import { GameDataUpdator } from "../lib/game-data-lib/game-data-updator/game-data-updator";
import { GAME_DATA_UPDATORS } from "../lib/game-data-lib/game-data-updators/game-data-updators";
import { GlobalEvents } from "./global-events";
import { GoalReporter } from "../lib/game-data-lib/objective-progress/goal-reporter";
import { HideMouseCursor } from "../lib/streamer-lib/hide-mouse-cursor/hide-mouse-cursor";
import { HomebrewRegistry } from "../lib/homebrew-lib/homebrew-registry/homebrew-registry";
import { LastGameData } from "../lib/game-data-lib/last-game-data/last-game-data";
import { NumpadKeyAll } from "../lib/numpad-key-lib/numpad-key-all/numpad-key-all";
import { OnAgendaCard } from "../event/on-agenda-card/on-agenda-card";
import { OnAgendaStateCreated } from "../event/on-agenda-state-created/on-agenda-state-created";
import { OnChatMessage } from "../event/on-chat-message/on-chat-message";
import { OnCombatClicked } from "../event/on-combat-clicked/on-combat-clicked";
import { OnCombatResult } from "../event/on-combat-result/on-combat-result";
import { OnGameEnd } from "../event/on-game-end/on-game-end";
import { OnObjectFellThroughTable } from "../event/on-object-fell-through-table/on-object-fell-through-table";
import { OnPlanetCardSingleton } from "../event/on-planet-card-singleton/on-planet-card-singleton";
import { OnPlayerChangeColorRequest } from "../event/on-player-change-color-request/on-player-change-color-request";
import { OnPlayerChangedColor } from "../event/on-player-changed-color/on-player-changed-color";
import { OnSliceDraftRequest } from "../event/on-slice-draft-request/on-slice-draft-request";
import { OnStrategyCardPlayed } from "../event/on-strategy-card-played/on-strategy-card-played";
import { OnSystemActivated } from "../event/on-system-activated/on-system-activated";
import { OnTurnStateChanged } from "../event/on-turn-state-changed/on-turn-state-changed";
import { OnWhisper } from "../event/on-whisper/on-whisper";
import { PlanetAttachmentRegistry } from "../lib/system-lib/registry/planet-attachment-registry";
import { PlayerActionPhaseTime } from "../lib/player-lib/player-action-phase-time/player-action-phase-time";
import { PlayerColor } from "../lib/player-lib/player-color/player-color";
import { PlayerName } from "../lib/player-lib/player-name/player-name";
import { PlayerSeats } from "../lib/player-lib/player-seats/player-seats";
import { RemoveRegistry } from "../lib/remove-lib/registry/remove-registry";
import { ReportCommandTokenPutGet } from "../lib/command-token-lib/report-command-token-put-get/report-command-token-put-get";
import { ReportRemaining } from "../context-menu/report-remaining/report-remaining";
import { RightClickAgenda } from "../context-menu/right-click-agenda/right-click-agenda";
import { RightClickCrisis } from "../context-menu/cards/crisis/right-click-crisis";
//import { RightClickDelete } from "../context-menu/right-click-delete/right-click-delete";
import { RightClickExplore } from "../context-menu/system/explore-system/right-click-explore";
import { RightClickExtremeDuress } from "../context-menu/cards/extreme-duress/right-click-extreme-duress";
import { RightClickFracture } from "../context-menu/fracture/right-click-fracture";
import { RightClickGalvanizeToken } from "../context-menu/right-click-galvanize-token/right-click-galvanize-token";
import { RightClickGravleashManeuvers } from "../context-menu/cards/gravleash-maneuvers/right-click-gravleash-maneuvers";
import { RightClickHotPotatoScore } from "../context-menu/right-click-score/hot-potato-score";
import { RightClickIihqModernization } from "../context-menu/cards/iihq-modernization/right-click-iihq-modernization";
import { RightClickIihqModernizationBT } from "../context-menu/breakthroughs/iihq-modernization/iihq-modernization";
import { RightClickInfantry2 } from "../context-menu/cards/infantry-2/right-click-infantry-2";
import { RightClickLetaniWarrior2 } from "../context-menu/cards/infantry-2/right-click-letani-warrior-2";
import { RightClickMabanOmega } from "../context-menu/cards/maban-omega/right-click-maban-omega";
import { RightClickMabanOmegaAlliance } from "../context-menu/cards/maban-omega/right-click-maban-omega-alliance";
import { RightClickMageonImplants } from "../context-menu/cards/mageon-implants/right-click-mageon-implants";
import { RightClickMercenaryContract } from "../context-menu/cards/mercenary-contract/mercenary-contract";
import { RightClickNanoForge } from "../context-menu/cards/nano-forge/right-click-nano-forge";
import { RightClickObsidianFirmament } from "../context-menu/obsidian-firmament/right-click-obsidian-firmament";
import { RightClickPirateContract } from "../context-menu/cards/pirate-contract/pirate-contract";
import { RightClickPirateFleet } from "../context-menu/cards/pirate-fleet/pirate-fleet";
import { RightClickPurge } from "../context-menu/right-click-purge/right-click-purge";
import { RightClickRider } from "../context-menu/right-click-rider/right-click-rider";
import { RightClickRift } from "../context-menu/right-click-rift/right-click-rift";
import { RightClickScorePrivate } from "../context-menu/right-click-score/right-click-score-private";
import { RightClickScorePublic } from "../context-menu/right-click-score/right-click-score-public";
import { RightClickSleeperToken } from "../context-menu/right-click-sleeper-token/right-click-sleeper-token";
import { RightClickSpecOps2 } from "../context-menu/cards/infantry-2/right-click-spec-ops-2";
import { RightClickStellarConverter } from "../context-menu/cards/stellar-converter/right-click-stellar-converter";
import { RightClickThundersEdge } from "../context-menu/right-click-thunders-edge/right-click-thunders-edge";
import { RunInjectScript } from "../lib/homebrew-lib/run-inject-script/run-inject-script";
import { RSwapSplitCombine } from "./r-swap-split-combine";
import { ShuffleDecks } from "./shuffle-decks";
import { SlashCommandRegistry } from "../lib/slash-command-lib/slash-command-registry/slash-command-registry";
import { StartGame } from "../lib/start-game-lib/start-game";
import { StartGameWindow } from "../lib/start-game-lib/start-game-window";
import { SystemAttachmentRegistry } from "../lib/system-lib/registry/system-attachment-registry";
import { SystemRegistry } from "../lib/system-lib/registry/system-registry";
import { TechRegistry } from "../lib/tech-lib/registry/tech-registry";
import { ToggleAgenda } from "../context-menu/toggle-agenda/toggle-agenda";
import { ToggleActionPhaseTimes } from "../context-menu/toggle-action-phase-times/toggle-action-phase-times";
import { ToggleAllPlayersTech } from "../context-menu/toggle-all-players-tech/toggle-all-players-tech";
import { ToggleBorders } from "../context-menu/toggle-borders/toggle-borders";
import { ToggleCombatWindow } from "../context-menu/toggle-combat-window/toggle-combat-window";
import { ToggleHelp } from "../context-menu/toggle-help/toggle-help";
import { ToggleMapTool } from "../context-menu/toggle-map-tool/toggle-map-tool";
import { ToggleStats } from "../context-menu/toggle-stats/toggle-stats";
import { ToggleStratCards } from "../context-menu/toggle-strat-cards/toggle-strat-cards";
import { ToggleStreamerTool } from "../context-menu/toggle-streamer-tool/toggle-streamer-tool";
import { ToggleTechChooser } from "../context-menu/toggle-tech-chooser/toggle-tech-chooser";
import { UnitAttrsRegistry } from "../lib/unit-lib/registry/unit-attrs-registry";
import { UnitModifierActiveIdle } from "../lib/unit-lib/unit-modifier/unit-modifier-active-idle";
import { UnitModifierRegistry } from "../lib/unit-lib/registry/unit-modifier-registry";
import { UnpackFactionContextMenuItem } from "../context-menu/unpack-faction/unpack-faction";
import { UpdatorHistory } from "../lib/game-data-lib/updators/updator-history/updator-history";
import { UseStreamerBuddy } from "../lib/streamer-lib/use-streamer-buddy/use-streamer-buddy";
import { WhisperSpy } from "../lib/streamer-lib/whisper-spy/whisper-spy";

// Events
import { RightClickAgeOfExploration } from "../context-menu/events/age-of-exploration/right-click-age-of-exploration";
import { RightClickMinorFactions } from "../context-menu/events/minor-factions/right-click-minor-factions";
import { OnStartThundersEdge } from "../event/on-start-thunders-edge/on-start-thunders-edge";

// Breakthroughs
import { RightClickYinAscendant } from "../context-menu/breakthroughs/yin-ascendant/right-click-yin-ascendant";

// Twilight's Fall
import { RightClickTFAbilitySplice } from "../context-menu/tf-splice/right-click-tf-ability";
import { RightClickTFGenomeSplice } from "../context-menu/tf-splice/right-click-tf-genome";
import { RightClickTFParadigmSplice } from "../context-menu/tf-splice/right-click-tf-paradigm";
import { RightClickTFUnitUpgradeSplice } from "../context-menu/tf-splice/right-click-tf-unit-upgrade";

import { LOCALE_CONTEXT_MENUS } from "../locale/locale-context-menus";

import { NSID_TO_TEMPLATE_ID } from "../nsid/nsid-to-template-id";
import { OnStartTwilightsFall } from "../event/on-start-twilights-fall/on-start-twilights-fall";
import { TFAhkSylFier } from "../context-menu/tf-fetch-tokens/tf-ahk-syl-fier";
import { TFAwakeningGeoform } from "../context-menu/tf-fetch-tokens/tf-awakening-geoform";
import { TFDimensionalTear } from "../context-menu/tf-fetch-tokens/tf-dimensional-tear";
import { TFHeliosEntity } from "../context-menu/tf-fetch-tokens/tf-helios-entity";
import { TFSingularityX } from "../context-menu/tf-fetch-tokens/tf-singularity-x";
import { TFSingularityY } from "../context-menu/tf-fetch-tokens/tf-singularity-y";
import { TFSingularityZ } from "../context-menu/tf-fetch-tokens/tf-singularity-z";
import { TFTelepathicNaalu0 } from "../context-menu/tf-fetch-tokens/tf-telepathic-naalu-0";
import { RightClickTFSupercharge } from "../context-menu/cards/tf-supercharge/tf-superchange";

import { HeroDimensionalAnchor } from "../context-menu/heroes/hero-dimensional-anchor/hero-dimensional-anchor";
import { HeroHelioCommandArray } from "../context-menu/heroes/hero-helio-command-array/hero-helio-command-array";
import { HeroMultiverseShift } from "../context-menu/heroes/hero-multiverse-shift/hero-multiverse-shift";
import { DraftActivityMaybeResumeTF } from "../lib";

const packageId: string = refPackageId;
Find.ignoreOwnedCardHolderNsid("card-holder:base/player-scoring");

if (GameWorld.getExecutionReason() !== "unittest") {
  console.log("--- Welcome to TI4 ---");
}

export function registerErrorHandler() {
  if (GameWorld.getExecutionReason() !== "unittest") {
    // Initialize error handing when running in production.
    new ErrorHandler().init();
    new BugSplatRemoteReporter({
      database: "da_test",
      appName: "TI4-TTPG-TS",
      appVersion: "1",
    }).init();
  }
}
registerErrorHandler();

export class TI4Class {
  // Strings.
  public readonly locale = locale;

  // Events.
  public readonly events = Object.freeze(new GlobalEvents());

  // Libraries.
  public readonly autoStreamerCamera = new AutoStreamerCamera(
    "@auto-streamer-camera/ti4"
  );
  public readonly borders = new AllBorders();
  public readonly config = new Config("@config/ti4");
  public readonly hex = new Hex(HEX_LAYOUT_POINTY, 5.77735 * 1.5);
  public readonly factionRegistry = new FactionRegistry()
    .loadDefaultData()
    .loadDefaultRewriteNsid();
  public readonly findTracking = new FindTracking();
  public readonly gameDataUpdator = new GameDataUpdator(
    GAME_DATA_UPDATORS
  ).startPeriodicUpdatesInProduction();
  public readonly goalReporter = new GoalReporter();
  public readonly hideMouseCursor = new HideMouseCursor(
    "@hide-mouse-cursor/ti4"
  );
  public readonly homebrewRegistry = new HomebrewRegistry();
  public readonly lastGameData = new LastGameData();
  public readonly systemAttachmentRegistry =
    new SystemAttachmentRegistry().loadDefaultData(); // do this BEFORE planet attachments so they can attach to system attachments (e.g. mirage)
  public readonly planetAttachmentRegistry =
    new PlanetAttachmentRegistry().loadDefaultData();
  public readonly playerActionPhaseTime = new PlayerActionPhaseTime(
    "@player-action-phase-time/ti4"
  );
  public readonly playerColor = new PlayerColor("@player-color/ti4");
  public readonly playerName = new PlayerName();
  public readonly playerSeats = new PlayerSeats();
  public readonly removeRegistry = new RemoveRegistry().loadDefaultData();
  public readonly slashCommandRegistry =
    new SlashCommandRegistry().loadDefaultData();
  public readonly spawn = __spawn.inject(NSID_TO_TEMPLATE_ID);
  public readonly systemRegistry = new SystemRegistry().loadDefaultData();
  public readonly techRegistry = new TechRegistry().loadDefaultData();
  public readonly timer = new Timer("@timer/ti4");
  public readonly turnOrder = new TurnOrder("@turn-order/ti4");
  public readonly unitAttrsRegistry = new UnitAttrsRegistry().loadDefaultData();
  public readonly unitModifierRegistry =
    new UnitModifierRegistry().loadDefaultData();
  public readonly useStreamerBuddy = new UseStreamerBuddy(
    "@use-streamer-buddy/ti4"
  );
  public readonly whisperSpy = new WhisperSpy("@whisper-spy/ti4");
}

// Also place "TI4" in the global namespace.
declare global {
  // eslint-disable-next-line no-var
  var TI4: TI4Class;
  var __spawn: Spawn;
}
globalThis.__spawn = new Spawn();

// Expose a reset function so tests can reset.
// ttpg-mock resets globalEvents after each test, breaking listeners here.
export function resetGlobalThisTI4(): TI4Class {
  globalThis.TI4 = new TI4Class();
  Object.freeze(globalThis.TI4);

  TI4.locale.inject(LOCALE_CONTEXT_MENUS);

  // Run any delayed initialization, things that need globalThis.TI4 to be set.
  // These are "init" functions in the class objects.
  const iGlobals: Array<IGlobal> = [
    new ActivateSystem(),
    new ApplyLocaleDescriptions(),
    new ControlTokenSystem(),
    new DiceGroupCleanup(),
    new DiplomacySystem(),
    // new DisplayPDSAdjacency(),
    new GameDataExport(),
    new HeroDimensionalAnchor(),
    new HeroHelioCommandArray(),
    new HeroMultiverseShift(),
    new LeaveSeat(),
    new NumpadKeyAll(),
    new OnAgendaCard(),
    new OnAgendaStateCreated(),
    new OnCardBecameSingletonOrDeck(),
    new OnChatMessage(),
    new OnCombatClicked(),
    new OnCombatResult(),
    new OnGameEnd(),
    new OnObjectFellThroughTable(),
    new OnPlanetCardSingleton(),
    new OnPlayerChangeColorRequest(),
    new OnPlayerChangedColor(),
    new OnSliceDraftRequest(),
    new OnStartThundersEdge(),
    new OnStartTwilightsFall(),
    new OnStrategyCardPlayed(),
    new OnSystemActivated(),
    new OnTurnStateChanged(),
    new OnWhisper(),
    new ReportCommandTokenPutGet(),
    new ReportRemaining(),
    new RightClickAgenda(),
    new RightClickCrisis(),
    new RightClickExplore(),
    new RightClickExtremeDuress(),
    new RightClickFracture(),
    new RightClickGalvanizeToken(),
    new RightClickGravleashManeuvers(),
    new RightClickHotPotatoScore(),
    new RightClickIihqModernization(),
    new RightClickIihqModernizationBT(),
    new RightClickInfantry2(),
    new RightClickLetaniWarrior2(),
    new RightClickMabanOmega(),
    new RightClickMabanOmegaAlliance(),
    new RightClickMageonImplants(),
    new RightClickMercenaryContract(),
    new RightClickNanoForge(),
    new RightClickObsidianFirmament(),
    new RightClickPirateContract(1),
    new RightClickPirateContract(2),
    new RightClickPirateContract(3),
    new RightClickPirateContract(4),
    new RightClickPirateFleet(),
    new RightClickPurge(),
    new RightClickRider(),
    new RightClickRift(),
    new RightClickScorePrivate(),
    new RightClickScorePublic(),
    new RightClickSleeperToken(),
    new RightClickSpecOps2(),
    new RightClickStellarConverter(),
    new RightClickTFAbilitySplice(),
    new RightClickTFGenomeSplice(),
    new RightClickTFParadigmSplice(),
    new RightClickTFSupercharge(),
    new RightClickTFUnitUpgradeSplice(),
    new RightClickThundersEdge(),
    new RightClickYinAscendant(),
    new RSwapSplitCombine(),
    new RunInjectScript(),
    new ShuffleDecks(),
    new StartGame(),
    new StartGameWindow(),
    new TFAhkSylFier(),
    new TFAwakeningGeoform(),
    new TFDimensionalTear(),
    new TFHeliosEntity(),
    new TFSingularityX(),
    new TFSingularityY(),
    new TFSingularityZ(),
    new TFTelepathicNaalu0(),
    new ToggleActionPhaseTimes(),
    new ToggleAgenda(),
    new ToggleAllPlayersTech(),
    new ToggleBorders(),
    new ToggleCombatWindow(),
    new ToggleHelp(),
    new ToggleMapTool(),
    new ToggleStats(),
    new ToggleStratCards(),
    new ToggleStreamerTool(),
    new ToggleTechChooser(),
    new UnitModifierActiveIdle(),
    new UnpackFactionContextMenuItem(),
    new WhisperReporter(),

    // Events.
    new RightClickAgeOfExploration(),
    new RightClickMinorFactions(),

    // Do these last to be below "real" right click options.
    //new RightClickDelete(),
  ];

  // Add UI and some bug workarounds to production runs.
  if (GameWorld.getExecutionReason() !== "unittest") {
    iGlobals.push(
      ...[
        new BugCardHolderAssignment("card-holder:base/player-hand"),
        ////new BugForceTransformUpdates(),
        new BugUniqueCards(),
        new CreateAndAttachEndTurnButtonUI(),
        new CreateAndAttachTurnOrderUI(),
      ]
    );
  }

  // Some game data updators need IGlobal.  This is a hack.
  for (const updator of GAME_DATA_UPDATORS) {
    if (updator instanceof UpdatorHistory) {
      iGlobals.push(updator);
    }
  }

  // Finally run any "after everything else" init functions.
  iGlobals.push(
    ...[
      new AgendaActivityMaybeResume(),
      new DraftActivityMaybeResume(),
      new DraftActivityMaybeResumeTF(),
    ]
  );

  for (const v of Object.values(globalThis.TI4)) {
    if (typeof v.init === "function") {
      iGlobals.push(v);
    }
  }
  GlobalInit.runGlobalInit(iGlobals);

  return globalThis.TI4;
}

// Unittests reset the globalThis.TI4 object before each test.
// Only the main TI4 mod creates the global TI4 variable, other
// mods using the ti4-ttpg-ts npm module share the same instance.
const isTest: boolean = GameWorld.getExecutionReason() === "unittest";
const devId: string = "F5DD9DEDA6C64881A2EEBBC273224D01";
const prdId: string = "F5DD9DEDA6C64881A2EEBBC273224D02";
const isMainMod: boolean = packageId === devId || packageId === prdId;
if (!isTest && isMainMod) {
  resetGlobalThisTI4();
  TI4.config.onConfigChanged.add(() => {
    BugSplatRemoteReporter.setEnabled(TI4.config.reportErrors);
  });
  BugSplatRemoteReporter.setEnabled(TI4.config.reportErrors);
}

world.setShowDiceRollMessages(false); // Disable default TTPG messages for dice rolls.
