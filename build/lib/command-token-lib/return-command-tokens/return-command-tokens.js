"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnCommandTokens = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const recycle_token_command_1 = require("../../recycle-lib/handlers/token/recycle-token-command/recycle-token-command");
/**
 * Return command tokens on system tiles to players' supplies.
 */
class ReturnCommandTokens {
    constructor() {
        this._recycleCommandToken = new recycle_token_command_1.RecycleTokenCommand();
    }
    getAllCommandTokensOnMap() {
        const hexes = new Set();
        const commandTokens = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("tile.system:")) {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                hexes.add(hex);
            }
            if (nsid.startsWith("token.command:")) {
                commandTokens.push(obj);
            }
        }
        return commandTokens.filter((commandToken) => {
            const pos = commandToken.getPosition();
            const hex = TI4.hex.fromPosition(pos);
            return hexes.has(hex);
        });
    }
    /**
     * Return command tokens for only one player (for Sol's hero).
     *
     * @param playerSlot
     */
    returnOnePlayersCommandTokens(playerSlot) {
        const commandTokens = this.getAllCommandTokensOnMap().filter((commandToken) => commandToken.getOwningPlayerSlot() === playerSlot);
        for (const commandToken of commandTokens) {
            if (this._recycleCommandToken.canRecycle(commandToken)) {
                this._recycleCommandToken.recycle(commandToken);
            }
        }
    }
    returnAllCommandTokens() {
        const commandTokens = this.getAllCommandTokensOnMap();
        for (const commandToken of commandTokens) {
            if (this._recycleCommandToken.canRecycle(commandToken)) {
                this._recycleCommandToken.recycle(commandToken);
            }
        }
    }
}
exports.ReturnCommandTokens = ReturnCommandTokens;
//# sourceMappingURL=return-command-tokens.js.map