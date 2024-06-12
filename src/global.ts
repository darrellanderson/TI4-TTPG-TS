import { SYSTEM_DATA } from "./lib/system-lib/data/system.data";
import { SystemRegistry } from "./lib/system-lib/registry/system-registry";

export class TI4Class {
  systemRegistry: SystemRegistry = new SystemRegistry().load(SYSTEM_DATA);
}
const TI4 = new TI4Class();
Object.freeze(TI4);

// Place "TI4" in the global namespace.
declare global {
  var TI4: TI4Class;
}
globalThis.TI4 = TI4;

// Run any delayed initialization, things that need globalThis.TI4 to be set.
// TODO XXX
