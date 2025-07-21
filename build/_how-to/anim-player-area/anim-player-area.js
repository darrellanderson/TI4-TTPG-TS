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
exports.AnimPlayerArea = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const anim_camera_1 = require("../anim-lib/anim-camera");
const anim_delay_1 = require("../anim-lib/anim-delay");
const anim_highlight_1 = require("../anim-lib/anim-highlight");
class AnimPlayerArea {
    constructor(playerSlot) {
        this._find = new ttpg_darrell_1.Find();
        this._playerSlot = playerSlot;
    }
    _getObj(nsid) {
        const skipContained = true;
        const obj = new ttpg_darrell_1.Find().findGameObject(nsid, this._playerSlot, skipContained);
        if (!obj) {
            const msg = `Object with NSID ${nsid} not found`;
            console.error(msg);
            throw new Error(msg);
        }
        return obj;
    }
    _getTroves() {
        const troves = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "mat.player:base/trove") {
                const pos = obj.getPosition();
                const closest = this._find.closestOwnedCardHolderOwner(pos);
                if (closest === this._playerSlot) {
                    troves.push(obj);
                }
            }
        }
        return troves;
    }
    fullTour() {
        return __awaiter(this, void 0, void 0, function* () {
            const z = anim_camera_1.AnimCamera.CAMERA_Z;
            let obj;
            obj = this._getObj("sheet.faction:base/generic");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("mat:base/status-pad");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            anim_highlight_1.AnimHighlight.simple(obj, 1000);
            yield anim_delay_1.AnimDelay.simple(1000);
            // Camera doesn't move, add a short delay before re-highlighting.
            yield anim_delay_1.AnimDelay.simple(1000);
            const troves = this._getTroves();
            for (const trove of troves) {
                anim_highlight_1.AnimHighlight.simple(trove, 1000);
            }
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("mat.player:base/build");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            anim_highlight_1.AnimHighlight.simple(obj, 1000);
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("mat.player:base/planet");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            anim_highlight_1.AnimHighlight.simple(obj, 1000);
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("mat.player:base/technology");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            anim_highlight_1.AnimHighlight.simple(obj, 1000);
            yield anim_delay_1.AnimDelay.simple(1000);
            obj = this._getObj("card-holder:base/player-hand");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            anim_highlight_1.AnimHighlight.simple(obj, 1000);
            yield anim_delay_1.AnimDelay.simple(1000);
        });
    }
    miniTour() {
        return __awaiter(this, void 0, void 0, function* () {
            const z = anim_camera_1.AnimCamera.CAMERA_Z;
            const obj = this._getObj("sheet.faction:base/generic");
            yield anim_camera_1.AnimCamera.simpleObj(obj, z);
            yield anim_delay_1.AnimDelay.simple(1000);
        });
    }
}
exports.AnimPlayerArea = AnimPlayerArea;
//# sourceMappingURL=anim-player-area.js.map