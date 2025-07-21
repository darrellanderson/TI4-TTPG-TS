"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhisperSpy = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Report whisper CONTENTS to the streamer.
 */
class WhisperSpy {
    constructor(namespaceId) {
        this._reportToPlayerNames = new Set();
        this._onWhisper = (sender, recipient, message) => {
            const src = TI4.playerName.getByPlayer(sender);
            const srcColor = api_1.world.getSlotColor(sender.getSlot());
            const dst = TI4.playerName.getByPlayer(recipient);
            const spyMsg = `[WHISPER SPY ${src} -> ${dst}: ${message}]`;
            for (const player of api_1.world.getAllPlayers()) {
                if (this._reportToPlayerNames.has(player.getName())) {
                    if (this.isLegalReportTo(player)) {
                        ttpg_darrell_1.Broadcast.chatOne(player, spyMsg, srcColor);
                    }
                    else {
                        const errMsg = "[WHISPER SPY: <error, can only report to unseated observers>]";
                        ttpg_darrell_1.Broadcast.chatOne(player, errMsg, ttpg_darrell_1.Broadcast.ERROR);
                    }
                }
            }
        };
        this._namespaceId = namespaceId;
        this._load();
    }
    init() {
        api_1.globalEvents.onWhisper.add(this._onWhisper);
    }
    /**
     * To prevent abuse, only report to unseated players.
     *
     * @param player
     */
    isLegalReportTo(player) {
        const playerSlot = player.getSlot();
        const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
        return seatIndex === -1;
    }
    hasReportTo(player) {
        return this._reportToPlayerNames.has(player.getName());
    }
    addReportTo(player) {
        const playerName = player.getName();
        this._reportToPlayerNames.add(playerName);
        this._save();
    }
    removeReportTo(player) {
        const playerName = player.getName();
        this._reportToPlayerNames.delete(playerName);
        this._save();
    }
    _save() {
        const json = JSON.stringify(Array.from(this._reportToPlayerNames));
        api_1.world.setSavedData(json, this._namespaceId);
    }
    _load() {
        const json = api_1.world.getSavedData(this._namespaceId);
        if (json && json.length > 0) {
            const names = JSON.parse(json);
            this._reportToPlayerNames.clear();
            for (const name of names) {
                this._reportToPlayerNames.add(name);
            }
        }
    }
}
exports.WhisperSpy = WhisperSpy;
//# sourceMappingURL=whisper-spy.js.map