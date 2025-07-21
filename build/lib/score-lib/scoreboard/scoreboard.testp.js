"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const scoreboard_1 = require("./scoreboard");
for (const obj of api_1.world.getAllObjects()) {
    if (obj !== api_1.refObject) {
        obj.destroy();
    }
}
console.log("scoreboard.testp.ts");
const dx = 40;
const dy = 20;
const z = api_1.world.getTableHeight() + 10;
const posArray = [
    new api_1.Vector(dx, dy, z),
    new api_1.Vector(dx, 0, z),
    new api_1.Vector(dx, -dy, z),
    new api_1.Vector(-dx, -dy, z),
    new api_1.Vector(-dx, 0, z),
    new api_1.Vector(-dx, dy, z),
];
let obj;
obj = ttpg_darrell_1.Spawn.spawnOrThrow("token:base/scoreboard", [0, 0, z]);
obj.setRotation(new api_1.Rotator(0, 0, 180));
obj.snapToGround();
const scoreboardLib = new scoreboard_1.Scoreboard();
posArray.forEach((pos, index) => {
    obj = ttpg_darrell_1.Spawn.spawnOrThrow("card-holder:base/player-hand", pos);
    obj.setOwningPlayerSlot(index + 1);
});
for (let i = 0; i < posArray.length; i++) {
    obj = ttpg_darrell_1.Spawn.spawnOrThrow("token.control:base/sol");
    obj.setOwningPlayerSlot(i + 1);
    obj.setPrimaryColor(api_1.world.getSlotColor(i + 1));
    const pos = (_a = scoreboardLib.scoreToPos(1, i + 1)) !== null && _a !== void 0 ? _a : new api_1.Vector(0, 0, 0);
    const rot = (_b = scoreboardLib.getControlTokenRotation()) !== null && _b !== void 0 ? _b : new api_1.Rotator(0, 0, 0);
    console.log(pos.toString(), api_1.world.getTableHeight());
    obj.setPosition(pos.add([0, 0, 5]));
    obj.setRotation(rot);
    obj.snapToGround();
}
//# sourceMappingURL=scoreboard.testp.js.map