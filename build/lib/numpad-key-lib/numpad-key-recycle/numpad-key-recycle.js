"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeyRecycle = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const CONTROL_KEY_NEEDED = 3;
ttpg_darrell_1.locale.inject({
    "ui.error.numpad0_control": "Numpad-0 restricted, press control + numpad-0 {remaining} {#remaining|time|times} to access numpad-0 to trash objects",
    "ui.error.numpad0_progress": "Press control + numpad-0 {remaining} more {#remaining|time|times} to access",
    "ui.error.numpad0_granted": "Numpad-0 access granted",
});
class NumpadKeyRecycle {
    constructor(key) {
        this._playerNameToCtrlKeyCount = new Map();
        this._onScriptButtonPressed = (player, index, ctrl, alt) => {
            // Our key?
            if (index !== this._key || alt) {
                return;
            }
            // Require control+key several times to enable normal key based recycle.
            const name = player.getName(); // key off player name
            let count = this._playerNameToCtrlKeyCount.get(name) || 0;
            if (ctrl) {
                count += 1;
                this._playerNameToCtrlKeyCount.set(player.getName(), count);
                if (count < CONTROL_KEY_NEEDED) {
                    // Report progress.
                    ttpg_darrell_1.Broadcast.chatOne(player, (0, ttpg_darrell_1.locale)("ui.error.numpad0_progress", {
                        remaining: CONTROL_KEY_NEEDED - count,
                    }), ttpg_darrell_1.Broadcast.ERROR);
                }
                else if (count === CONTROL_KEY_NEEDED) {
                    // Report access granted.
                    ttpg_darrell_1.Broadcast.chatOne(player, (0, ttpg_darrell_1.locale)("ui.error.numpad0_granted"), ttpg_darrell_1.Broadcast.ERROR);
                }
            }
            else {
                if (count < CONTROL_KEY_NEEDED) {
                    // Report progress needed.
                    ttpg_darrell_1.Broadcast.chatOne(player, (0, ttpg_darrell_1.locale)("ui.error.numpad0_control", {
                        remaining: CONTROL_KEY_NEEDED - count,
                    }), ttpg_darrell_1.Broadcast.ERROR);
                }
                else {
                    // Do recycle.
                    const objs = player.getHeldObjects();
                    for (const obj of objs) {
                        ttpg_darrell_1.GarbageContainer.tryRecycle(obj, player);
                    }
                }
            }
        };
        this._key = key;
        api_1.globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
        api_1.globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
    }
    destroy() {
        api_1.globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
    }
    // expose for testing.
    _getCtrlKeyCount(player) {
        return this._playerNameToCtrlKeyCount.get(player.getName()) || 0;
    }
}
exports.NumpadKeyRecycle = NumpadKeyRecycle;
//# sourceMappingURL=numpad-key-recycle.js.map