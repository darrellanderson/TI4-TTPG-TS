"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatUI = void 0;
const api_1 = require("@tabletop-playground/api");
const faction_ui_1 = require("../faction-ui/faction-ui");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
class SeatUI extends abtract_ui_1.AbstractUI {
    static _getPlayerSlotOrThrow(seatIndex) {
        const playerSeatType = TI4.playerSeats.getAllSeats()[seatIndex];
        if (!playerSeatType) {
            throw new Error(`Unexpected seat index: ${seatIndex}`);
        }
        return playerSeatType.playerSlot;
    }
    static _getLabelOrThrow(seatIndex, speakerSeatIndex) {
        const playerCount = TI4.config.playerCount;
        let pickCount = seatIndex - speakerSeatIndex;
        if (pickCount < 0) {
            pickCount += playerCount;
        }
        const result = [
            "Speaker",
            "2nd Pick",
            "3rd Pick",
            "4th Pick",
            "5th Pick",
            "6th Pick",
            "7th Pick",
            "8th Pick",
        ][pickCount];
        if (result === undefined) {
            throw new Error(`Unexpected pick count: ${pickCount}`);
        }
        return result.toUpperCase();
    }
    constructor(seatIndex, speakerSeatIndex, scale) {
        const w = faction_ui_1.BOX_W * scale;
        const h = faction_ui_1.BOX_H * scale;
        const fontSize = faction_ui_1.FONT_SIZE * scale;
        const label = SeatUI._getLabelOrThrow(seatIndex, speakerSeatIndex);
        const playerSlot = SeatUI._getPlayerSlotOrThrow(seatIndex);
        const color = api_1.world.getSlotColor(playerSlot);
        const text = new api_1.Text()
            .setBold(true)
            .setFontSize(fontSize)
            .setTextColor(color)
            .setText(label);
        const widget = new api_1.LayoutBox()
            .setOverrideWidth(w)
            .setOverrideHeight(h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(text);
        super(widget, { w: faction_ui_1.BOX_W * scale, h: faction_ui_1.BOX_H * scale });
    }
}
exports.SeatUI = SeatUI;
//# sourceMappingURL=seat-ui.js.map