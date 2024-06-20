import { System } from "./system";
import { SystemLabels } from "./system-labels";

const systems: Array<System> = TI4.systemRegistry.getOnTableSystems();
systems.forEach((system) => {
  console.log("system", system.getName());
  new SystemLabels(system).attach();
});
