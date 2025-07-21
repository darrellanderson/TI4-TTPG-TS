"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickInfantry2 = void 0;
const abstract_infantry_2_1 = require("./abstract-infantry-2");
class RightClickInfantry2 extends abstract_infantry_2_1.AbstractInfantry2 {
    constructor() {
        const cardNsid = "card.technology.unit-upgrade:base/infantry-2";
        const rollValue = 6;
        super(cardNsid, rollValue);
    }
}
exports.RightClickInfantry2 = RightClickInfantry2;
//# sourceMappingURL=right-click-infantry-2.js.map