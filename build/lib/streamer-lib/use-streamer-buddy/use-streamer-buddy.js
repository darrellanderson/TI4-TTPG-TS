"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseStreamerBuddy = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class UseStreamerBuddy {
    constructor(namespaceId) {
        this.onStreamerBuddyChanged = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._useStreeamerBuddy = false;
        this._onGameData = (gameData) => {
            if (this._useStreeamerBuddy) {
                const json = JSON.stringify(gameData);
                const url = `http://localhost:8080/postkey_ttpg?key=buddy&timestamp=${TI4.config.timestamp}`;
                const fetchOptions = {
                    headers: { "Content-type": "application/json;charset=UTF-8" },
                    body: json,
                    method: "POST",
                };
                fetch(url, fetchOptions);
            }
        };
        this._namespaceId = namespaceId;
        this._load();
    }
    init() {
        TI4.events.onGameData.add(this._onGameData);
    }
    getUseStreamerBuddy() {
        return this._useStreeamerBuddy;
    }
    setUseStreamerBuddy(useStreamerBuddy) {
        this._useStreeamerBuddy = useStreamerBuddy;
        this._save();
        this.onStreamerBuddyChanged.trigger(this._useStreeamerBuddy);
    }
    _load() {
        const json = api_1.world.getSavedData(this._namespaceId);
        if (json && json.length > 0) {
            this._useStreeamerBuddy = JSON.parse(json);
        }
    }
    _save() {
        const json = JSON.stringify(this._useStreeamerBuddy);
        api_1.world.setSavedData(json, this._namespaceId);
    }
}
exports.UseStreamerBuddy = UseStreamerBuddy;
//# sourceMappingURL=use-streamer-buddy.js.map