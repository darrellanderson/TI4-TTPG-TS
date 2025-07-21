"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoStreamerCamera = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const scoreboard_1 = require("../../score-lib/scoreboard/scoreboard");
/**
 * Move the player's camera:
 *
 * - To system on system activation.
 * - To full map on turn change.
 * - To scoring area on all passed.
 *
 * No camera movement necessary for agenda, agenda UI is on screen.
 */
class AutoStreamerCamera {
    constructor(namespaceId) {
        this._streamerPlayerSlots = new Set();
        this._scoreboard = new scoreboard_1.Scoreboard();
        this._onAllPlayersPassed = () => {
            this._lookAtScoring();
        };
        this._onSystemActivated = (system, _player) => {
            this._lookAtSystem(system);
        };
        this._onTurnStateChanged = (_turnOrder) => {
            this._lookAtFullMap();
        };
        this._namespaceId = namespaceId;
        this._load();
    }
    init() {
        TI4.events.onAllPlayersPassed.add(this._onAllPlayersPassed);
        TI4.events.onSystemActivated.add(this._onSystemActivated);
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
    }
    destroy() {
        TI4.events.onAllPlayersPassed.remove(this._onAllPlayersPassed);
        TI4.events.onSystemActivated.remove(this._onSystemActivated);
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.remove(this._onTurnStateChanged);
        api_1.world.setSavedData("", this._namespaceId);
    }
    addStreamerPlayerSlot(playerSlot) {
        this._streamerPlayerSlots.add(playerSlot);
        this._save();
    }
    hasStreamerPlayerSlot(playerSlot) {
        return this._streamerPlayerSlots.has(playerSlot);
    }
    removeStreamerPlayerSlot(playerSlot) {
        this._streamerPlayerSlots.delete(playerSlot);
        this._save();
    }
    _load() {
        this._streamerPlayerSlots.clear();
        const json = api_1.world.getSavedData(this._namespaceId);
        if (json && json.length > 0) {
            const playerSlots = JSON.parse(json);
            for (const playerSlot of playerSlots) {
                this._streamerPlayerSlots.add(playerSlot);
            }
        }
    }
    _save() {
        const json = JSON.stringify(Array.from(this._streamerPlayerSlots));
        api_1.world.setSavedData(json, this._namespaceId);
    }
    _lookAtSystem(system) {
        const lookAtPos = system.getObj().getPosition();
        this._lookAt(lookAtPos, 20);
    }
    _lookAtScoring() {
        const scoreboardObj = this._scoreboard.getScoreboard();
        if (scoreboardObj) {
            const lookAtPos = scoreboardObj.getPosition().add([-13, 0, 0]);
            this._lookAt(lookAtPos, 60);
        }
    }
    _lookAtFullMap() {
        const lookAtPos = new api_1.Vector(0, 0, api_1.world.getTableHeight());
        this._lookAt(lookAtPos, 110);
    }
    _lookAt(pos, height) {
        pos.z = api_1.world.getTableHeight();
        const lookFrom = pos.add([-10, 0, height]);
        const rot = lookFrom.findLookAtRotation(pos);
        for (const playerSlot of this._streamerPlayerSlots) {
            const player = api_1.world.getPlayerBySlot(playerSlot);
            if (player) {
                player.setPositionAndRotation(lookFrom, rot);
            }
        }
    }
}
exports.AutoStreamerCamera = AutoStreamerCamera;
//# sourceMappingURL=auto-streamer-camera.js.map