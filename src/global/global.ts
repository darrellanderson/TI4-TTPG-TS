import { GameWorld, Vector } from "@tabletop-playground/api";
import {
  BugCardHolderAssignment,
  BugSplatRemoteReporter,
  BugUniqueCards,
  DiceGroupCleanup,
  ErrorHandler,
  Find,
  GlobalInit,
  Hex,
  HEX_LAYOUT_POINTY, // TTPG inverts x/y axis
  IGlobal,
  LeaveSeat,
  OnCardBecameSingletonOrDeck,
  Spawn,
  Timer,
  TurnOrder,
  WhisperReporter,
} from "ttpg-darrell";

import { addObjectTemplatesToMockWorld } from "../nsid/nsid-to-template-id.test";
import { ActivateSystem } from "../context-menu/system/activate-system/activate-system";
import { AgendaActivityMaybeResume } from "../lib/agenda-lib/agenda-activity-start/agenda-activity-start";
import { AllBorders } from "../lib/border-lib/all-borders/all-borders";
import { AutoStreamerCamera } from "../lib/streamer-lib/auto-streamer-camera/auto-streamer-camera";
import { Config } from "../lib/config/config";
import { ControlTokenSystem } from "../context-menu/system/control-token-system/control-token-system";
import { CreateAndAttachEndTurnButtonUI } from "../ui/end-turn-button-ui/create-and-attach-end-turn-button-ui";
import { CreateAndAttachTurnOrderUI } from "../ui/turn-order-ui/create-and-attach-turn-order-ui";
import { DiplomacySystem } from "../context-menu/system/diplomacy-system/diplomacy-system";
import { DisplayPDSAdjacency } from "../context-menu/display-pds-adjacency/display-pds-adjacency";
import { DraftActivityMaybeResume } from "../lib/draft-lib/draft-activity-start/draft-activity-start";
import { FactionRegistry } from "../lib/faction-lib/registry/faction-registry";
import { GameDataExport } from "../lib/game-data-lib/game-data-export/game-data-export";
import { GameDataUpdator } from "../lib/game-data-lib/game-data-updator/game-data-updator";
import { GAME_DATA_UPDATORS } from "../lib/game-data-lib/game-data-updators/game-data-updators";
import { GlobalEvents } from "./global-events";
import { HideMouseCursor } from "../lib/streamer-lib/hide-mouse-cursor/hide-mouse-cursor";
import { NumpadKeyAll } from "../lib/numpad-key-lib/numpad-key-all/numpad-key-all";
import { OnAgendaCard } from "../event/on-agenda-card/on-agenda-card";
import { OnCombatClicked } from "../event/on-combat-clicked/on-combat-clicked";
import { OnCombatResult } from "../event/on-combat-result/on-combat-result";
import { OnGameEnd } from "../event/on-game-end/on-game-end";
import { OnObjectFellThroughTable } from "../event/on-object-fell-through-table/on-object-fell-through-table";
import { OnPlayerChangeColorRequest } from "../event/on-player-change-color-request/on-player-change-color-request";
import { OnPlayerChangedColor } from "../event/on-player-changed-color/on-player-changed-color";
import { OnSliceDraftRequest } from "../event/on-slice-draft-request/on-slice-draft-request";
import { OnStrategyCardPlayed } from "../event/on-strategy-card-played/on-strategy-card-played";
import { OnSystemActivated } from "../event/on-system-activated/on-system-activated";
import { OnTurnStateChanged } from "../event/on-turn-state-changed/on-turn-state-changed";
import { PlanetAttachmentRegistry } from "../lib/system-lib/registry/planet-attachment-registry";
import { PlayerActionPhaseTime } from "../lib/player-lib/player-action-phase-time/player-action-phase-time";
import { PlayerColor } from "../lib/player-lib/player-color/player-color";
import { PlayerName } from "../lib/player-lib/player-name/player-name";
import { PlayerSeats } from "../lib/player-lib/player-seats/player-seats";
import { RemoveRegistry } from "../lib/remove-lib/registry/remove-registry";
import { ReportCommandTokenPutGet } from "../lib/command-token-lib/report-command-token-put-get/report-command-token-put-get";
import { ReportRemaining } from "../context-menu/report-remaining/report-remaining";
import { RightClickAgenda } from "../context-menu/right-click-agenda/right-click-agenda";
import { RightClickExplore } from "../context-menu/system/explore-system/right-click-explore";
import { RightClickIihqModernization } from "../context-menu/cards/iihq-modernization/right-click-iihq-modernization";
import { RightClickInfantry2 } from "../context-menu/cards/infantry-2/right-click-infantry-2";
import { RightClickLetaniWarrior2 } from "../context-menu/cards/infantry-2/right-click-letani-warrior-2";
import { RightClickMabanOmega } from "../context-menu/cards/maban-omega/right-click-maban-omega";
import { RightClickMabanOmegaAlliance } from "../context-menu/cards/maban-omega/right-click-maban-omega-alliance";
import { RightClickMageonImplants } from "../context-menu/cards/mageon-implants/right-click-mageon-implants";
import { RightClickNanoForge } from "../context-menu/cards/nano-forge/right-click-nano-forge";
import { RightClickPurge } from "../context-menu/right-click-purge/right-click-purge";
import { RightClickRider } from "../context-menu/right-click-rider/right-click-rider";
import { RightClickRift } from "../context-menu/right-click-rift/right-click-rift";
import { RightClickScorePrivate } from "../context-menu/right-click-score/right-click-score-private";
import { RightClickScorePublic } from "../context-menu/right-click-score/right-click-score-public";
import { RightClickSpecOps2 } from "../context-menu/cards/infantry-2/right-click-spec-ops-2";
import { RightClickStellarConverter } from "../context-menu/cards/stellar-converter/right-click-stellar-converter";
import { RSwapSplitCombine } from "./r-swap-split-combine";
import { SetupPlayerSlotColors } from "../setup/setup-player-slot-colors/setup-player-slot-colors";
import { ShuffleDecks } from "./shuffle-decks";
import { StartGame } from "../lib/start-game-lib/start-game";
import { StartGameWindow } from "../lib/start-game-lib/start-game-window";
import { SystemAttachmentRegistry } from "../lib/system-lib/registry/system-attachment-registry";
import { SystemRegistry } from "../lib/system-lib/registry/system-registry";
import { TechRegistry } from "../lib/tech-lib/registry/tech-registry";
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
import { UseStreamerBuddy } from "../lib/streamer-lib/use-streamer-buddy/use-streamer-buddy";

import * as NSID_TO_TEMPLATE_ID from "../nsid/nsid-to-template-id.json";
Spawn.inject(NSID_TO_TEMPLATE_ID);

Find.ignoreOwnedCardHolderNsid("card-holder:base/player-scoring");

export function registerErrorHandler() {
  if (GameWorld.getExecutionReason() !== "unittest") {
    console.log("--- Welcome to TI4 ---");

    // Initialize error handing when running in production.
    new ErrorHandler().init();
    new BugSplatRemoteReporter({
      database: "da_test",
      appName: "TI4-TTPG-TS",
      appVersion: "1",
    }); //.init();
  }
}
registerErrorHandler();

export class TI4Class {
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
  public readonly gameDataUpdator = new GameDataUpdator(
    GAME_DATA_UPDATORS
  ).startPeriodicUpdatesInProduction();
  public readonly hideMouseCursor = new HideMouseCursor(
    "@hide-mouse-cursor/ti4"
  );
  public readonly planetAttachmentRegistry =
    new PlanetAttachmentRegistry().loadDefaultData();
  public readonly playerActionPhaseTime = new PlayerActionPhaseTime(
    "@player-action-phase-time/ti4"
  );
  public readonly playerColor = new PlayerColor("@player-color/ti4");
  public readonly playerName = new PlayerName();
  public readonly playerSeats = new PlayerSeats();
  public readonly removeRegistry = new RemoveRegistry().loadDefaultData();
  public readonly systemAttachmentRegistry =
    new SystemAttachmentRegistry().loadDefaultData();
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
}

// Also place "TI4" in the global namespace.
declare global {
  // eslint-disable-next-line no-var
  var TI4: TI4Class;
}

// Expose a reset function so tests can reset.
// ttpg-mock resets globalEvents after each test, breaking listeners here.
export function resetGlobalThisTI4(): TI4Class {
  globalThis.TI4 = new TI4Class();
  Object.freeze(globalThis.TI4);

  // Run any delayed initialization, things that need globalThis.TI4 to be set.
  // These are "init" functions in the class objects.
  const iGlobals: Array<IGlobal> = [
    new ActivateSystem(),
    new ControlTokenSystem(),
    new DiceGroupCleanup(),
    new DiplomacySystem(),
    new DisplayPDSAdjacency(),
    new GameDataExport(),
    new LeaveSeat(),
    new NumpadKeyAll(),
    new OnAgendaCard(),
    new OnCardBecameSingletonOrDeck(),
    new OnCombatClicked(),
    new OnCombatResult(),
    new OnGameEnd(),
    new OnObjectFellThroughTable().setRelocateTo(new Vector(0, -250, 0)),
    new OnPlayerChangeColorRequest(),
    new OnPlayerChangedColor(),
    new OnSliceDraftRequest(),
    new OnStrategyCardPlayed(),
    new OnSystemActivated(),
    new OnTurnStateChanged(),
    new ReportCommandTokenPutGet(),
    new ReportRemaining(),
    new RightClickAgenda(),
    new RightClickExplore(),
    new RightClickIihqModernization(),
    new RightClickInfantry2(),
    new RightClickLetaniWarrior2(),
    new RightClickMabanOmega(),
    new RightClickMabanOmegaAlliance(),
    new RightClickMageonImplants(),
    new RightClickNanoForge(),
    new RightClickPurge(),
    new RightClickRider(),
    new RightClickRift(),
    new RightClickScorePrivate(),
    new RightClickScorePublic(),
    new RightClickSpecOps2(),
    new RightClickStellarConverter(),
    new RSwapSplitCombine(),
    new ShuffleDecks(),
    new StartGame(),
    new StartGameWindow(),
    new ToggleActionPhaseTimes(),
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
  ];

  // Add UI and some bug workarounds to production runs.
  if (GameWorld.getExecutionReason() !== "unittest") {
    iGlobals.push(
      ...[
        new BugCardHolderAssignment("card-holder:base/player-hand"),
        //new BugForceTransformUpdates(),
        new BugUniqueCards(),
        new CreateAndAttachEndTurnButtonUI(),
        new CreateAndAttachTurnOrderUI(),
      ]
    );
  }

  // Finally run any "after everything else" init functions.
  iGlobals.push(
    ...[new AgendaActivityMaybeResume(), new DraftActivityMaybeResume()]
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
if (GameWorld.getExecutionReason() === "unittest") {
  beforeEach(() => {
    addObjectTemplatesToMockWorld(); // does a MockWorld._reset!
    resetGlobalThisTI4();
    new SetupPlayerSlotColors().setup(); // normally part of table state creation
  });
} else {
  resetGlobalThisTI4();
}
