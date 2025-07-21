"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_labels_1 = require("./system-labels");
system_labels_1.SystemLabels.removePlanetLines();
const systems = TI4.systemRegistry.getAllSystemsWithObjs(true);
systems.forEach((system) => {
    console.log("system", system.getName());
    new system_labels_1.SystemLabels(system).attach();
});
//# sourceMappingURL=system-labels.testp.js.map