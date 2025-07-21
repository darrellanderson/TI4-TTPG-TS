"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
// Wait a frame to:
// (1) let creator finish setting up if a new object,
// (2) let player data become valid if (re)loading.
const obj = api_1.refHolder; // ref* gets cleared end of frame
let cardHolderPlayerName = undefined;
process.nextTick(() => {
    if (obj.isValid()) {
        cardHolderPlayerName = new ttpg_darrell_1.CardHolderPlayerName(obj).setFontSizeAndPosition(64);
    }
});
TI4.events.onPlayerChangedColor.add((playerSlot) => {
    if (playerSlot === obj.getOwningPlayerSlot()) {
        const color = TI4.playerColor.getSlotWidgetColor(playerSlot);
        if (cardHolderPlayerName && color) {
            cardHolderPlayerName.setColor(color);
        }
    }
});
//# sourceMappingURL=card-holder-player.js.map