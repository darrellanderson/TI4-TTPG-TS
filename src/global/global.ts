import { GameWorld } from "@tabletop-playground/api";
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
} from "ttpg-darrell";

import { addObjectTemplatesToMockWorld } from "../nsid/nsid-to-template-id.test";
import { ActivateSystem } from "../context-menu/system/activate-system/activate-system";
import { AgendaActivityMaybeResume } from "../lib/agenda-lib/agenda-activity-start/agenda-activity-start";
import { Config } from "../lib/config/config";
import { ControlTokenSystem } from "../context-menu/system/control-token-system/control-token-system";
import { CreateAndAttachEndTurnButtonUI } from "../ui/end-turn-button-ui/create-and-attach-end-turn-button-ui";
import { CreateAndAttachTurnOrderUI } from "../ui/turn-order-ui/create-and-attach-turn-order-ui";
import { DiplomacySystem } from "../context-menu/system/diplomacy-system/diplomacy-system";
import { DisplayPDSAdjacency } from "../context-menu/display-pds-adjacency/display-pds-adjacency";
import { DraftActivityMaybeResume } from "../lib/draft-lib/draft-activity-start/draft-activity-start";
import { FactionRegistry } from "../lib/faction-lib/registry/faction-registry";
import { GlobalEvents } from "./global-events";
import { NumpadKeyAll } from "../lib/numpad-key-lib/numpad-key-all/numpad-key-all";
import { OnAgendaCard } from "../event/on-agenda-card/on-agenda-card";
import { OnCombatClicked } from "../event/on-combat-clicked/on-combat-clicked";
import { OnCombatResult } from "../event/on-combat-result/on-combat-result";
import { OnPlayerChangeColorRequest } from "../event/on-player-change-color-request/on-player-change-color-request";
import { OnPlayerChangedColor } from "../event/on-player-changed-color/on-player-changed-color";
import { OnSystemActivated } from "../event/on-system-activated/on-system-activated";
import { PlanetAttachmentRegistry } from "../lib/system-lib/registry/planet-attachment-registry";
import { PlayerColor } from "../lib/player-lib/player-color/player-color";
import { PlayerName } from "../lib/player-lib/player-name/player-name";
import { PlayerSeats } from "../lib/player-lib/player-seats/player-seats";
import { RemoveRegistry } from "../lib/remove-lib/registry/remove-registry";
import { ReportRemaining } from "../context-menu/report-remaining/report-remaining";
import { RightClickExplore } from "../context-menu/system/explore-system/right-click-explore";
import { RightClickScorePrivate } from "../context-menu/right-click-score/right-click-score-private";
import { RightClickScorePublic } from "../context-menu/right-click-score/right-click-score-public";
import { RSwapSplitCombine } from "./r-swap-split-combine";
import { SetupPlayerSlotColors } from "../setup/setup-player-slot-colors/setup-player-slot-colors";
import { ShuffleDecks } from "./shuffle-decks";
import { SystemAttachmentRegistry } from "../lib/system-lib/registry/system-attachment-registry";
import { SystemRegistry } from "../lib/system-lib/registry/system-registry";
import { TechRegistry } from "../lib/tech-lib/registry/tech-registry";
import { UnitAttrsRegistry } from "../lib/unit-lib/registry/unit-attrs-registry";
import { UnitModifierActiveIdle } from "../lib/unit-lib/unit-modifier/unit-modifier-active-idle";
import { UnitModifierRegistry } from "../lib/unit-lib/registry/unit-modifier-registry";
import { UnpackFactionContextMenuItem } from "../context-menu/unpack-faction/unpack-faction";

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
  public readonly config = new Config("@config/ti4");
  public readonly hex = new Hex(HEX_LAYOUT_POINTY, 5.77735 * 1.5);
  public readonly factionRegistry = new FactionRegistry()
    .loadDefaultData()
    .loadDefaultRewriteNsid();
  public readonly planetAttachmentRegistry =
    new PlanetAttachmentRegistry().loadDefaultData();
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
    new LeaveSeat(),
    new NumpadKeyAll(),
    new OnAgendaCard(),
    new OnCardBecameSingletonOrDeck(),
    new OnCombatClicked(),
    new OnCombatResult(),
    new OnPlayerChangeColorRequest(),
    new OnPlayerChangedColor(),
    new OnSystemActivated(),
    new ReportRemaining(),
    new RightClickExplore(),
    new RightClickScorePrivate(),
    new RightClickScorePublic(),
    new RSwapSplitCombine(),
    new ShuffleDecks(),
    new UnitModifierActiveIdle(),
    new UnpackFactionContextMenuItem(),
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
