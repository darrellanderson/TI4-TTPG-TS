"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChatMessage = void 0;
const api_1 = require("@tabletop-playground/api");
const on_whisper_1 = require("../on-whisper/on-whisper");
/**
 * If a public chat message contains "@<player-name-prefix>",
 * chirp at that player.
 */
class OnChatMessage {
    constructor() {
        this._onChatMessage = (_sender, message) => {
            const parts = message.split(" ");
            parts.forEach((part) => {
                if (part.startsWith("@")) {
                    const playerName = part.substring(1).toLowerCase();
                    for (const player of api_1.world.getAllPlayers()) {
                        if (player.getName().toLowerCase().startsWith(playerName)) {
                            on_whisper_1.OnWhisper.chirpAtPlayer(player);
                        }
                    }
                }
            });
        };
    }
    init() {
        api_1.globalEvents.onChatMessage.add(this._onChatMessage);
    }
}
exports.OnChatMessage = OnChatMessage;
//# sourceMappingURL=on-chat-message.js.map