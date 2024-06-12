import { GlobalInit, Hex, HEX_LAYOUT_POINTY, IGlobal } from "ttpg-darrell";
import { SystemRegistry } from "../lib/system-lib/registry/system-registry";

export class TI4Class {
  // Events.

  // Libraries.
  hex: Hex = new Hex(HEX_LAYOUT_POINTY, 5.77735 * 1.5);
  systemRegistry: SystemRegistry = new SystemRegistry().loadDefaultData();
}

// Place "TI4" in the global namespace.
declare global {
  var TI4: TI4Class;
}
globalThis.TI4 = new TI4Class();
Object.freeze(globalThis.TI4);

// Run any delayed initialization, things that need globalThis.TI4 to be set.
// These are "init" functions in the class objects.
const iGlobals: Array<IGlobal> = [];
for (const [k, v] of Object.entries(globalThis.TI4)) {
  if (typeof v.init === "function") {
    iGlobals.push(v);
  }
}
GlobalInit.runGlobalInit(iGlobals);
