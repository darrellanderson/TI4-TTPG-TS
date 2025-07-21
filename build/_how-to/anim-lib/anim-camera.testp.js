"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const anim_camera_1 = require("./anim-camera");
const maybePlayer = api_1.world.getAllPlayers()[0];
if (!maybePlayer) {
    throw new Error("No player found");
}
const player = maybePlayer;
const lookFrom = new api_1.Vector(-9, 0, api_1.world.getTableHeight() + 1);
const lookAt = new api_1.Vector(0, 0, lookFrom.z - 0.1);
const r0 = lookFrom.findLookAtRotation(lookAt);
const p1 = new api_1.Vector(0, 0, api_1.world.getTableHeight() + 70);
function go() {
    const z = 70;
    anim_camera_1.AnimCamera.simple(p1, z).then(() => {
        console.log("AnimCamera done");
    });
}
const actionName = "*Anim-camera";
api_1.refObject.addCustomAction(actionName);
api_1.refObject.onCustomAction.add((_obj, _player, action) => {
    if (action === actionName) {
        player.setPositionAndRotation(lookFrom, r0);
        process.nextTick(() => {
            go();
        });
    }
});
//# sourceMappingURL=anim-camera.testp.js.map