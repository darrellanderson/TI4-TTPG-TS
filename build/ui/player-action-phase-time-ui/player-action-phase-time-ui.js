"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerActionPhaseTimeUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
class PlayerActionPhaseTimeUI extends abtract_ui_1.AbstractUI {
    static _formatTime(secondsTotal) {
        const hours = Math.floor(secondsTotal / 3600);
        const minutes = Math.floor(secondsTotal / 60) % 60;
        const seconds = secondsTotal % 60;
        const hoursString = `${hours}`;
        let minutesString = `${minutes}`;
        if (hours > 0 && minutes < 10) {
            minutesString = `0${minutes}`;
        }
        let secondsString = `${seconds}`;
        if (seconds < 10) {
            secondsString = `0${seconds}`;
        }
        const parts = [];
        if (hours > 0) {
            parts.push(hoursString);
        }
        parts.push(minutesString);
        parts.push(secondsString);
        return parts.join(":");
    }
    constructor(scale) {
        const numStandardWidths = 3;
        const numPlayers = TI4.config.playerCount;
        const scaledWidth = (config_1.CONFIG.BUTTON_WIDTH * numStandardWidths +
            config_1.CONFIG.SPACING * (numStandardWidths - 1)) *
            scale;
        const scaledHeight = (config_1.CONFIG.BUTTON_HEIGHT * (numPlayers + 2) + config_1.CONFIG.SPACING * numPlayers) *
            scale *
            0.65; // +2 for header/footer, extra scale b/c tighter than usual ui
        const box = new api_1.LayoutBox()
            .setOverrideWidth(scaledWidth)
            .setOverrideHeight(scaledHeight);
        super(box, { w: scaledWidth, h: scaledHeight });
        this._roundToSeatIndexToTimeText = [];
        this.intervalHandle = undefined;
        this._onInterval = () => {
            this.update();
        };
        box.setChild(this._createInnerWidget(scale));
        this.update();
        this.intervalHandle = setInterval(this._onInterval, 1000);
    }
    destroy() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = undefined;
        }
        super.destroy();
    }
    _createInnerWidget(scale) {
        const labelWeight = 1;
        const timeWeight = 0.4;
        const horizontalBox = new api_1.HorizontalBox().setChildDistance(config_1.CONFIG.SPACING * scale);
        // Round "zero" doesn't exist, use it for player names.
        // Use seat-index -1 for player names.
        for (let round = 0; round <= 6; round++) {
            const verticalBox = new api_1.VerticalBox().setChildDistance(config_1.CONFIG.SPACING * scale);
            const weight = round === 0 ? labelWeight : timeWeight;
            // Use a dark background on alternating columns.
            let widget = verticalBox;
            if (round % 2 === 1) {
                const border = new api_1.Border()
                    .setColor(config_1.CONFIG.DARKER)
                    .setChild(verticalBox);
                widget = border;
            }
            horizontalBox.addChild(widget, weight);
            const seatIndexToTimeText = [];
            this._roundToSeatIndexToTimeText[round] = seatIndexToTimeText;
            for (let seatIndex = -1; // extra for header
             seatIndex < TI4.config.playerCount + 1; // extra for TOTAL
             seatIndex++) {
                const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
                const text = new api_1.Text()
                    .setBold(true)
                    .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
                    .setText(`${round}/${seatIndex}`);
                if (playerSlot >= 0) {
                    const color = api_1.world.getSlotColor(playerSlot);
                    text.setTextColor(color);
                }
                if (round > 0) {
                    text.setJustification(api_1.TextJustification.Center);
                }
                seatIndexToTimeText[seatIndex] = text;
                verticalBox.addChild(text, 1);
            }
        }
        return horizontalBox;
    }
    update() {
        for (let round = 0; round <= 6; round++) {
            for (let seatIndex = -1; // extra for header
             seatIndex < TI4.config.playerCount + 1; // extra for TOTAL
             seatIndex++) {
                this._updateRoundAndSeatIndex(round, seatIndex);
            }
        }
    }
    _updateRoundAndSeatIndex(round, seatIndex) {
        const seatIndexToTimeText = this._roundToSeatIndexToTimeText[round];
        if (!seatIndexToTimeText) {
            return;
        }
        const text = seatIndexToTimeText[seatIndex];
        if (!text) {
            return;
        }
        if (round === 0) {
            // First column, header and player names.
            if (seatIndex === -1) {
                text.setText("ROUND");
            }
            else if (seatIndex >= TI4.config.playerCount) {
                text.setText("TOTAL");
            }
            else {
                const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
                text.setText(TI4.playerName.getBySlot(playerSlot));
            }
        }
        else {
            if (seatIndex === -1) {
                // First row, header.
                text.setText(`${round}`);
            }
            else if (seatIndex >= TI4.config.playerCount) {
                // Last row, TOTAL.
                let totalSeconds = 0;
                for (let i = 0; i < TI4.config.playerCount; i++) {
                    totalSeconds += TI4.playerActionPhaseTime.getSeconds(round, i);
                }
                const textString = PlayerActionPhaseTimeUI._formatTime(totalSeconds);
                text.setText(textString);
            }
            else {
                // Player action phase time.
                const totalSeconds = TI4.playerActionPhaseTime.getSeconds(round, seatIndex);
                const textString = PlayerActionPhaseTimeUI._formatTime(totalSeconds);
                text.setText(textString);
            }
        }
    }
}
exports.PlayerActionPhaseTimeUI = PlayerActionPhaseTimeUI;
//# sourceMappingURL=player-action-phase-time-ui.js.map