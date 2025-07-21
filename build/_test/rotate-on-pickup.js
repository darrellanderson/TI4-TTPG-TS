"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
api_1.refObject.onGrab.add((obj, _player) => {
    obj.setRotation([0, 0, 270]);
});
//# sourceMappingURL=rotate-on-pickup.js.map