"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorSpeaker = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorSpeaker {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        const nsid = "token:base/speaker";
        const owningPlayerSlot = undefined;
        const skipContained = true;
        const speakerToken = this._find.findGameObject(nsid, owningPlayerSlot, skipContained);
        if (speakerToken) {
            const pos = speakerToken.getPosition();
            const owner = this._find.closestOwnedCardHolderOwner(pos);
            const colorName = TI4.playerColor.getSlotColorName(owner);
            if (colorName) {
                gameData.speaker = colorName;
            }
        }
    }
}
exports.UpdatorSpeaker = UpdatorSpeaker;
//# sourceMappingURL=updator-speaker.js.map