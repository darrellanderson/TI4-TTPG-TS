"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemDefaults = void 0;
const api_1 = require("@tabletop-playground/api");
class SystemDefaults {
}
exports.SystemDefaults = SystemDefaults;
// Planet radius relative to system tile.
SystemDefaults.PLANET_RADIUS = 3;
// Home planet positions relative to system tile.
SystemDefaults.HOME_PLANET_POS = {
    POS_1_OF_1: new api_1.Vector(0.98, 0, 0),
    POS_1_OF_2: new api_1.Vector(3, -1.88, 0),
    POS_2_OF_2: new api_1.Vector(-2.7, 2.85, 0),
    POS_1_OF_3: new api_1.Vector(0.75, -4.13, 0),
    POS_2_OF_3: new api_1.Vector(3.45, 1.95, 0),
    POS_3_OF_3: new api_1.Vector(-3.6, 2.85, 0),
};
// Planet positions relative to system tile.
SystemDefaults.PLANET_POS = {
    POS_1_OF_1: new api_1.Vector(0, 0, 0),
    POS_1_OF_2: new api_1.Vector(3, -1.88, 0),
    POS_2_OF_2: new api_1.Vector(-3, 1.5, 0),
    POS_1_OF_3: new api_1.Vector(0.75, -4.5, 0),
    POS_2_OF_3: new api_1.Vector(3, 2.25, 0),
    POS_3_OF_3: new api_1.Vector(-4.05, 2.48, 0),
};
//# sourceMappingURL=system-defaults.js.map