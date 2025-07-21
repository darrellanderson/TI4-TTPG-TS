"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimCamera = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Move the player camera.
 */
class AnimCamera {
    /**
     * Look at the table-height dspPos from a slight southern position.
     *
     * @param dstPos
     * @returns
     */
    static simple(lookAt, z) {
        const player = api_1.world.getAllPlayers()[0];
        if (!player) {
            throw new Error("No player found");
        }
        const srcPos = player.getPosition();
        const srcRot = player.getRotation();
        lookAt.z = api_1.world.getTableHeight();
        const dstPos = lookAt.add([-10, 0, z]);
        const dstRot = dstPos.findLookAtRotation(lookAt);
        const animCamera = new AnimCamera({
            player,
            p0: srcPos,
            p1: dstPos,
            r0: srcRot,
            r1: dstRot,
            speed: 30,
        });
        return new Promise((resolve) => {
            animCamera.onDestroyed.add(() => {
                resolve();
            });
        });
    }
    static simpleObj(obj, z) {
        const pos = obj.getPosition();
        return AnimCamera.simple(pos, z);
    }
    constructor(params) {
        this.onDestroyed = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._tickCount = 0;
        this._onTick = (deltaMsecs) => {
            this._tickCount += 1;
            if (this._tickCount % 3 !== 0) {
                return; // camera stutters if we do every frame
            }
            this._cameraPos = api_1.Vector.interpolateToConstant(this._cameraPos, this._params.p1, deltaMsecs, this._params.speed * 3 // b/c skipping frames
            );
            const d = this._params.p0.distance(this._cameraPos);
            const tot = this._params.p0.distance(this._params.p1);
            const u = d / tot;
            const dstRot = api_1.Rotator.lerp(this._params.r0, this._params.r1, u, false);
            this._params.player.setPositionAndRotation(this._cameraPos, dstRot);
            if (this._params.p1.distance(this._cameraPos) < 0.01) {
                this.destroy();
            }
        };
        this._params = params;
        this._cameraPos = params.p0;
        api_1.globalEvents.onTick.add(this._onTick);
    }
    destroy() {
        api_1.globalEvents.onTick.remove(this._onTick);
        process.nextTick(() => {
            this.onDestroyed.trigger();
        });
    }
}
exports.AnimCamera = AnimCamera;
AnimCamera.CAMERA_Z = 70;
//# sourceMappingURL=anim-camera.js.map