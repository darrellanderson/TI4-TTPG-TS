"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorMapString = void 0;
const map_string_save_1 = require("../../../map-string-lib/map-string/map-string-save");
class UpdatorMapString {
    constructor() {
        this._mapStringSave = new map_string_save_1.MapStringSave();
    }
    update(gameData) {
        gameData.mapString = this._mapStringSave.save();
    }
}
exports.UpdatorMapString = UpdatorMapString;
//# sourceMappingURL=updator-map-string.js.map