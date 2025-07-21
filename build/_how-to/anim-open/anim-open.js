"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimOpen = void 0;
const api_1 = require("@tabletop-playground/api");
const anim_actor_1 = require("../anim-lib/anim-actor");
const anim_laser_1 = require("./anim-laser");
const ui_title_1 = require("./ui-title");
const anim_camera_1 = require("../anim-lib/anim-camera");
class AnimOpen {
    go(player) {
        for (const ui of api_1.world.getScreenUIs()) {
            api_1.world.removeScreenUIElement(ui);
        }
        for (const obj of api_1.world.getAllObjects()) {
            if (obj instanceof api_1.CardHolder) {
                for (const ui of obj.getUIs()) {
                    obj.removeUIElement(ui);
                }
            }
        }
        const uiTitle = new ui_title_1.UiTitle();
        const ui = uiTitle._createTitleUI();
        api_1.world.addUI(ui);
        const shipZ = api_1.world.getTableHeight() + 5;
        const lookFrom = new api_1.Vector(-9, 0, api_1.world.getTableHeight() + 1);
        const lookAt = new api_1.Vector(0, 0, lookFrom.z - 0.1);
        player.setPositionAndRotation(lookFrom, lookFrom.findLookAtRotation(lookAt));
        const carrier = new anim_actor_1.AnimActor({
            nsid: "unit:base/carrier",
            scale: 1,
            color: new api_1.Color(1, 1, 1, 1),
            p0: new api_1.Vector(-60, 10, shipZ),
            p1: new api_1.Vector(120, -20, shipZ),
            speed: 5,
        });
        const dreadnought = new anim_actor_1.AnimActor({
            nsid: "unit:base/dreadnought",
            scale: 3,
            color: new api_1.Color(1, 1, 1, 1),
            p0: new api_1.Vector(-90, 15, shipZ),
            p1: new api_1.Vector(120, -20, shipZ),
            speed: 5,
        });
        const _laser = new anim_laser_1.AnimLaser(carrier.getObj(), dreadnought.getObj());
        carrier.onDestroyed.add(() => {
            dreadnought.destroy();
            api_1.world.removeUIElement(ui);
        });
        return new Promise((resolve) => {
            let crossMsecs = 0;
            let startedAnimCamera = false;
            carrier.getObj().onTick.add(() => {
                if (crossMsecs === 0 && carrier.getObj().getPosition().x > 40) {
                    crossMsecs = Date.now();
                }
                if (crossMsecs > 0) {
                    const msecs = Date.now() - crossMsecs;
                    const tint = Math.max((3000 - msecs) / 3000, 0);
                    uiTitle.tint(tint);
                    let color;
                    color = carrier.getObj().getPrimaryColor();
                    color.a = tint;
                    carrier.getObj().setPrimaryColor(color);
                    carrier.getObj().setSecondaryColor(color);
                    color = dreadnought.getObj().getPrimaryColor();
                    color.a = tint;
                    dreadnought.getObj().setPrimaryColor(color);
                    dreadnought.getObj().setSecondaryColor(color);
                    if (tint <= 0 && !startedAnimCamera) {
                        startedAnimCamera = true;
                        const p1 = new api_1.Vector(0, 0, 0);
                        const z = 320;
                        anim_camera_1.AnimCamera.simple(p1, z).then(() => {
                            api_1.world.removeUIElement(ui);
                            resolve();
                        });
                    }
                }
            });
        });
    }
}
exports.AnimOpen = AnimOpen;
//# sourceMappingURL=anim-open.js.map