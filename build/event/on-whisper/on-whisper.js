"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnWhisper = void 0;
const api_1 = require("@tabletop-playground/api");
const packageId = api_1.refPackageId;
class OnWhisper {
    constructor() {
        this._onWhisper = (_sender, recipient, _message) => {
            OnWhisper.chirpAtPlayer(recipient);
        };
    }
    static chirpAtPlayer(player) {
        const startTime = 0;
        const volume = 1;
        const loop = false;
        const players = new api_1.PlayerPermission().addPlayer(player);
        OnWhisper.__sound.play(startTime, volume, loop, players);
    }
    init() {
        api_1.globalEvents.onWhisper.add(this._onWhisper);
    }
}
exports.OnWhisper = OnWhisper;
OnWhisper.__sound = api_1.world.importSound("digi-blip-hi-2x.flac", packageId);
//# sourceMappingURL=on-whisper.js.map