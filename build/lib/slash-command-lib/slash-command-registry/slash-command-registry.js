"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandRegistry = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const slash_command_data_1 = require("../data/slash-command.data");
class SlashCommandRegistry {
    constructor() {
        this._commandToAction = new Map();
        this._onChat = (sender, message) => {
            message = message.trim();
            if (message.startsWith("/")) {
                const argv = message.split(" ");
                let command = argv.shift();
                if (command) {
                    command = command.toLowerCase();
                    const entry = this._commandToAction.get(command);
                    if (entry) {
                        // Commands may be marked as host only.
                        if (entry.isHostOnly() && !sender.isHost()) {
                            const playerName = TI4.playerName.getByPlayer(sender);
                            const color = api_1.world.getSlotColor(sender.getSlot());
                            const msg = `${playerName} tried to run ${command} but is not host.`;
                            ttpg_darrell_1.Broadcast.chatAll(msg, color);
                            return;
                        }
                        entry.run(argv, sender);
                        const playerName = TI4.playerName.getByPlayer(sender);
                        const color = api_1.world.getSlotColor(sender.getSlot());
                        const msg = `${playerName} ran "${command}"`;
                        ttpg_darrell_1.Broadcast.chatAll(msg, color);
                    }
                }
            }
            if (message === "/") {
                ttpg_darrell_1.Broadcast.chatOne(sender, "Available slash commands:");
                for (const actions of this._commandToAction.values()) {
                    const command = actions.getSlashCommand();
                    const description = actions.getDescription();
                    ttpg_darrell_1.Broadcast.chatOne(sender, `${command}: ${description}`);
                }
            }
        };
    }
    init() {
        api_1.globalEvents.onChatMessage.add(this._onChat);
    }
    load(commands) {
        commands.forEach((command) => {
            const slashCommand = command.getSlashCommand().toLowerCase();
            // Must be unique.
            if (this._commandToAction.has(slashCommand)) {
                throw new Error(`Duplicate slash command: ${slashCommand}`);
            }
            this._commandToAction.set(slashCommand, command);
        });
        return this;
    }
    loadDefaultData() {
        this.load(slash_command_data_1.SLASH_COMMANDS);
        return this;
    }
}
exports.SlashCommandRegistry = SlashCommandRegistry;
//# sourceMappingURL=slash-command-registry.js.map