import { GameWorld, Player } from "@tabletop-playground/api";
import {
  BugCardHolderAssignment,
  BugSplatRemoteReporter,
  BugUniqueCards,
  DiceGroupCleanup,
  ErrorHandler,
  GlobalInit,
  Hex,
  HEX_LAYOUT_POINTY,
  IGlobal,
  LeaveSeat,
  OnCardBecameSingletonOrDeck,
  Spawn,
  Timer,
  TriggerableMulticastDelegate,
  TurnOrder,
} from "ttpg-darrell";

import { ActivateSystem } from "../context-menu/activate-system/activate-system";
import { Config } from "../lib/config/config";
import { CreateAndAttachEndTurnButtonUI } from "../ui/end-turn-button-ui/create-and-attach-end-turn-button-ui";
import { CreateAndAttachTurnOrderUI } from "../ui/turn-order-ui/create-and-attach-turn-order-ui";
import { DiplomacySystem } from "../context-menu/diplomacy-system/diplomacy-system";
import { FactionRegistry } from "../lib/faction-lib/registry/faction-registry";
import { OnSystemActivated } from "../event/on-system-activated/on-system-activated";
import { PlanetAttachmentRegistry } from "../lib/system-lib/registry/planet-attachment-registry";
import { PlayerColor } from "../lib/player-lib/player-color/player-color";
import { PlayerSeats } from "../lib/player-lib/player-seats/player-seats";
import { RemoveRegistry } from "../lib/remove-lib/registry/remove-registry";
import { RSwapSplitCombine } from "./r-swap-split-combine";
import { SetupPlayerSlotColors } from "../setup/setup-player-slot-colors/setup-player-slot-colors";
import { ShuffleDecks } from "./shuffle-decks";
import { System } from "lib/system-lib/system/system";
import { SystemAttachmentRegistry } from "../lib/system-lib/registry/system-attachment-registry";
import { SystemRegistry } from "../lib/system-lib/registry/system-registry";
import { TechRegistry } from "../lib/tech-lib/registry/tech-registry";
import { UnitAttrsRegistry } from "../lib/unit-lib/registry/unit-attrs-registry";
import { UnitModifierRegistry } from "../lib/unit-lib/registry/unit-modifier-registry";

import * as NSID_TO_TEMPLATE_ID from "../nsid/nsid-to-template-id.json";
Spawn.inject(NSID_TO_TEMPLATE_ID);

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
  public readonly onCardBecameSingletonOrDeck =
    new OnCardBecameSingletonOrDeck();
  public readonly onSystemActivated = new TriggerableMulticastDelegate<
    (system: System, player: Player) => void
  >();

  // Libraries.
  public readonly config = new Config("@config/ti4");
  public readonly hex = new Hex(HEX_LAYOUT_POINTY, 5.77735 * 1.5);
  public readonly factionRegistry = new FactionRegistry().loadDefaultData();
  public readonly planetAttachmentRegistry =
    new PlanetAttachmentRegistry().loadDefaultData();
  public readonly playerColor = new PlayerColor("@player-color/ti4");
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
    new DiceGroupCleanup(),
    new DiplomacySystem(),
    new LeaveSeat(),
    new OnSystemActivated(),
    new RSwapSplitCombine(),
    new ShuffleDecks(),
  ];
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
    resetGlobalThisTI4();
    new SetupPlayerSlotColors().setup();
  });
} else {
  resetGlobalThisTI4();
}
