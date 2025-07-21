"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scoreboard = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const SCOREBOARD_LOCAL_WIDTH = 43;
class Scoreboard {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    _getLocalCenter(score) {
        const scoreboard = this.getScoreboard();
        if (!scoreboard) {
            return undefined;
        }
        let dir = -1;
        let slotCount = 15;
        if (ttpg_darrell_1.Facing.isFaceUp(scoreboard)) {
            dir = 1;
            slotCount = 11;
        }
        // Tweak values very slighly for more precise centers, accounting
        // for one side of the scoreboard extending slightly.
        const slotWidth = (SCOREBOARD_LOCAL_WIDTH - 0.5) / slotCount;
        let mid = (slotCount - 1) / 2;
        mid -= 0.03;
        const dLeft = (score - mid) * slotWidth * dir;
        return new api_1.Vector(0.2, dLeft, 0);
    }
    /**
     * Get all control tokens on the scoreboard (normally just one).
     *
     * @returns
     */
    _getPlayerSlotToAtopControlTokens() {
        const playerSlotToControlTokens = new Map();
        const scoreboard = this.getScoreboard();
        if (scoreboard) {
            const atop = new ttpg_darrell_1.Atop(scoreboard);
            const skipContained = true;
            for (const obj of api_1.world.getAllObjects(skipContained)) {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                const pos = obj.getPosition();
                if (nsid.startsWith("token.control:") && atop.isAtop(pos)) {
                    const playerSlot = obj.getOwningPlayerSlot();
                    let controlTokens = playerSlotToControlTokens.get(playerSlot);
                    if (!controlTokens) {
                        controlTokens = [];
                        playerSlotToControlTokens.set(playerSlot, controlTokens);
                    }
                    controlTokens.push(obj);
                }
            }
        }
        return playerSlotToControlTokens;
    }
    /**
     * Get player slot to leading control token on the scoreboard (highest score).
     *
     * @returns
     */
    getPlayerSlotToLeadControlToken() {
        const playerSlotToToken = new Map();
        const playerSlotToControlTokens = this._getPlayerSlotToAtopControlTokens();
        for (const [playerSlot, controlTokens,] of playerSlotToControlTokens.entries()) {
            for (const controlToken of controlTokens) {
                const existingToken = playerSlotToToken.get(playerSlot);
                let useNewToken = true;
                if (existingToken) {
                    const existingPos = existingToken.getPosition();
                    const existingScore = this.posToScore(existingPos);
                    const newPos = controlToken.getPosition();
                    const newScore = this.posToScore(newPos);
                    if (existingScore !== undefined &&
                        newScore !== undefined &&
                        newScore < existingScore) {
                        useNewToken = false;
                    }
                }
                if (useNewToken) {
                    playerSlotToToken.set(playerSlot, controlToken);
                }
            }
        }
        return playerSlotToToken;
    }
    getLeadControlToken(playerSlot) {
        const playerSlotToToken = this.getPlayerSlotToLeadControlToken();
        return playerSlotToToken.get(playerSlot);
    }
    getPlayerSlotToScore() {
        const playerSlotToScore = new Map();
        const playerSlotToToken = this.getPlayerSlotToLeadControlToken();
        for (const [playerSlot, controlToken] of playerSlotToToken.entries()) {
            const pos = controlToken.getPosition();
            const score = this.posToScore(pos);
            if (score !== undefined) {
                playerSlotToScore.set(playerSlot, score);
            }
        }
        return playerSlotToScore;
    }
    getControlTokenRotation() {
        const scoreboard = this.getScoreboard();
        if (!scoreboard) {
            return undefined;
        }
        return new api_1.Rotator(0, 0, 0).compose(scoreboard.getRotation());
    }
    getScoreboard() {
        const playerSlot = undefined;
        const skipContained = true;
        return this._find.findGameObject("token:base/scoreboard", playerSlot, skipContained);
    }
    posToScore(pos) {
        const scoreboard = this.getScoreboard();
        if (!scoreboard) {
            return undefined;
        }
        let dir = -1;
        let slotCount = 15;
        if (ttpg_darrell_1.Facing.isFaceUp(scoreboard)) {
            dir = 1;
            slotCount = 11;
        }
        const slotWidth = SCOREBOARD_LOCAL_WIDTH / slotCount;
        const localPos = scoreboard.worldPositionToLocal(pos);
        const leftOffset = localPos.y * dir + SCOREBOARD_LOCAL_WIDTH / 2;
        let score = Math.floor(leftOffset / slotWidth);
        score = Math.max(score, 0);
        score = Math.min(score, slotCount - 1); // clamp
        return score;
    }
    scoreToPos(score, playerSlot) {
        const scoreboard = this.getScoreboard();
        const localCenter = this._getLocalCenter(score);
        if (!scoreboard || !localCenter) {
            return undefined;
        }
        const playerSeats = TI4.playerSeats.getAllSeats();
        const playerIndex = playerSeats.findIndex((playerSeat) => {
            return playerSeat.playerSlot === playerSlot;
        });
        if (playerIndex === -1) {
            // Unknown player, use the center position.
            return scoreboard.localPositionToWorld(localCenter);
        }
        const playerCount = playerSeats.length;
        const numRows = Math.ceil(playerCount / 2);
        let col = 0;
        let row = numRows - 1 - playerIndex;
        if (row < 0) {
            row = numRows - 1 - (numRows + row); // swap order
            col = 1;
        }
        // Fix for face down.
        if (!ttpg_darrell_1.Facing.isFaceUp(scoreboard)) {
            col = 1 - col;
        }
        // Make relative to center of score slot.
        row -= (numRows - 1) / 2;
        col -= 0.5;
        const y = localCenter.y - col * 1.5;
        const x = localCenter.x - row * 2.3;
        const localPos = new api_1.Vector(x, y, 0);
        return scoreboard.localPositionToWorld(localPos);
    }
}
exports.Scoreboard = Scoreboard;
//# sourceMappingURL=scoreboard.js.map