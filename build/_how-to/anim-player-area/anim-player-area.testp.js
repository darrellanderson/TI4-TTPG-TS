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
const api_1 = require("@tabletop-playground/api");
const anim_player_area_1 = require("./anim-player-area");
function runTour() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting 15");
        yield new anim_player_area_1.AnimPlayerArea(15).fullTour();
        console.log("Starting 12");
        yield new anim_player_area_1.AnimPlayerArea(12).miniTour();
        console.log("done");
    });
}
const actionName = "*Anim-player-area";
api_1.refObject.addCustomAction(actionName);
api_1.refObject.onCustomAction.add((_obj, _player, action) => {
    if (action === actionName) {
        runTour();
    }
});
//# sourceMappingURL=anim-player-area.testp.js.map