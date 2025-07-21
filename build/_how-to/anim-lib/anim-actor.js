"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimActor = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Animate a game object.
 */
class AnimActor {
    constructor(params) {
        this.onDestroyed = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._onTick = (obj, deltaMsecs) => {
            const srcPos = obj.getPosition();
            const dstPos = api_1.Vector.interpolateToConstant(srcPos, this._params.p1, deltaMsecs, this._params.speed);
            obj.setPosition(dstPos);
            if (srcPos.distance(dstPos) < 0.01) {
                this.destroy();
            }
        };
        this._params = params;
        const rot = this._params.p1.findLookAtRotation(params.p0);
        this._obj = ttpg_darrell_1.Spawn.spawnOrThrow(params.nsid, params.p0, rot);
        this._obj.setScale(new api_1.Vector(1, 1, 1).multiply(params.scale));
        this._obj.setPrimaryColor(params.color);
        this._obj.setPosition(params.p0);
        this._obj.toggleLock();
        this._obj.setTags(["_deleted_items_ignore_"]);
        this._obj.onTick.add(this._onTick);
    }
    destroy() {
        this._obj.onTick.remove(this._onTick);
        if (this._obj.isValid()) {
            this._obj.destroy();
            process.nextTick(() => {
                this.onDestroyed.trigger();
            });
        }
    }
    getObj() {
        return this._obj;
    }
}
exports.AnimActor = AnimActor;
//# sourceMappingURL=anim-actor.js.map