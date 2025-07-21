"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const ACTION_NAME = "*Choose Random Player";
api_1.refObject.addCustomAction(ACTION_NAME);
api_1.refObject.onCustomAction.add((_obj, _player, actionName) => {
    if (actionName === ACTION_NAME) {
        const seats = TI4.playerSeats.getAllSeats();
        const choice = Math.floor(Math.random() * seats.length);
        const seat = seats[choice];
        if (seat) {
            const playerSlot = seat.playerSlot;
            const playerName = TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
            ttpg_darrell_1.Broadcast.broadcastAll(`Speaker token chooses ${playerName}`);
        }
    }
});
//# sourceMappingURL=speaker-token.js.map