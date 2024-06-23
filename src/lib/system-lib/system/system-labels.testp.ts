import { System } from "./system";
import { SystemLabels } from "./system-labels";

SystemLabels.removePlanetLines();

const systems: Array<System> = TI4.systemRegistry.getAllSystemsWithObjs(true);
systems.forEach((system) => {
  console.log("system", system.getName());
  new SystemLabels(system).attach();
});
