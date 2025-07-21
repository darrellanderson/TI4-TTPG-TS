"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimMidTable = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const anim_camera_1 = require("../anim-lib/anim-camera");
const anim_delay_1 = require("../anim-lib/anim-delay");
class AnimMidTable {
    _getObj(nsid) {
        const skipContained = true;
        const obj = new ttpg_darrell_1.Find().findGameObject(nsid, undefined, skipContained);
        if (!obj) {
            const msg = `Object with NSID ${nsid} not found`;
            console.error(msg);
            throw new Error(msg);
        }
        return obj;
    }
    tour() {
        return __awaiter(this, void 0, void 0, function* () {
            const z = anim_camera_1.AnimCamera.CAMERA_Z;
            let obj;
            //obj = this._getObj("tile.system:base/18");
            //await AnimCamera.simpleObj(obj, z);
            //await AnimDelay.simple(1000);
            obj = this._getObj("mat:base/strategy-card");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("mat:base/combat-arena");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("mat.deck:base/base");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("mat:base/objective-2");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            yield anim_delay_1.AnimDelay.simple(1000);
        });
    }
}
exports.AnimMidTable = AnimMidTable;
//# sourceMappingURL=anim-mid-table.js.map