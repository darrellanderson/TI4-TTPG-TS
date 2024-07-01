import { GameWorld } from "@tabletop-playground/api";
import {
  BugSplatRemoteReporter,
  ErrorHandler,
  GlobalInit,
  Hex,
  HEX_LAYOUT_POINTY,
  IGlobal,
  OnCardBecameSingletonOrDeck,
} from "ttpg-darrell";

import { PlanetAttachmentRegistry } from "../lib/system-lib/registry/planet-attachment-registry";
import { SystemAttachmentRegistry } from "../lib/system-lib/registry/system-attachment-registry";
import { SystemRegistry } from "../lib/system-lib/registry/system-registry";
import { UnitAttrsRegistry } from "../lib/unit-lib/registry/unit-attrs-registry";
import { UnitModifierRegistry } from "../lib/unit-lib/registry/unit-modifier-registry";

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
  onCardBecameSingletonOrDeck = new OnCardBecameSingletonOrDeck();

  // Libraries.
  hex = new Hex(HEX_LAYOUT_POINTY, 5.77735 * 1.5);
  planetAttachmentRegistry = new PlanetAttachmentRegistry().loadDefaultData();
  systemAttachmentRegistry = new SystemAttachmentRegistry().loadDefaultData();
  systemRegistry = new SystemRegistry().loadDefaultData();
  unitAttrsRegistry = new UnitAttrsRegistry().loadDefaultData();
  unitModifierRegistry = new UnitModifierRegistry().loadDefaultData();
}

// Also place "TI4" in the global namespace.
declare global {
  var TI4: TI4Class;
}

// Expose a reset function so tests can reset.
// ttpg-mock resets globalEvents after each test, breaking listeners here.
export function resetGlobalThisTI4(): TI4Class {
  globalThis.TI4 = new TI4Class();
  Object.freeze(globalThis.TI4);
  return globalThis.TI4;
}
resetGlobalThisTI4();

// Run any delayed initialization, things that need globalThis.TI4 to be set.
// These are "init" functions in the class objects.
const iGlobals: Array<IGlobal> = [];
for (const [k, v] of Object.entries(globalThis.TI4)) {
  if (typeof v.init === "function") {
    iGlobals.push(v);
  }
}
GlobalInit.runGlobalInit(iGlobals);

if (GameWorld.getExecutionReason() === "unittest") {
  beforeEach(() => {
    resetGlobalThisTI4();
  });
}
