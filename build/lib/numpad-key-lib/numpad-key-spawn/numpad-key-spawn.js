"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeySpawn = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class NumpadKeySpawn {
    constructor(keyToNsid) {
        this._onScriptButtonPressed = (player, index, ctrl, alt) => {
            const nsid = this._keyToNsid[index];
            if (nsid && !ctrl && !alt) {
                const pos = player.getCursorPosition();
                pos.z = api_1.world.getTableHeight() + 10;
                const obj = ttpg_darrell_1.Spawn.spawn(nsid, pos);
                if (obj) {
                    obj.snapToGround();
                }
            }
        };
        // Validate NSIDs.
        for (const key in keyToNsid) {
            const nsid = keyToNsid[key];
            if (!nsid || !ttpg_darrell_1.Spawn.has(nsid)) {
                throw new Error(`NumpadKeySpawn: Unknown NSID: "${keyToNsid[key]}"`);
            }
        }
        this._keyToNsid = keyToNsid;
        api_1.globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
    }
    destroy() {
        api_1.globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
    }
}
exports.NumpadKeySpawn = NumpadKeySpawn;
//# sourceMappingURL=numpad-key-spawn.js.map