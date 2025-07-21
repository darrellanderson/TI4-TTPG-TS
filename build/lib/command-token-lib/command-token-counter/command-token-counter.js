"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandTokenCounter = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class CommandTokenCounter {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    getPlayerSlotToCommandTokenCounts() {
        // Gather relevant objects in a single pass.
        const commandSheets = [];
        const commandTokens = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "sheet:base/command") {
                commandSheets.push(obj);
            }
            else if (nsid.startsWith("token.command:")) {
                commandTokens.push(obj);
            }
        }
        // Organize command sheets, create a command token allocation for each.
        // Assumes only one command sheet per player.
        const playerSlotToCommandSheet = new Map();
        for (const commandSheet of commandSheets) {
            const playerSlot = this._find.closestOwnedCardHolderOwner(commandSheet.getPosition());
            playerSlotToCommandSheet.set(playerSlot, commandSheet);
        }
        // Create command token allocations.
        const playerSlotToCommandTokenCounts = new Map();
        for (const playerSlot of playerSlotToCommandSheet.keys()) {
            playerSlotToCommandTokenCounts.set(playerSlot, {
                tactic: [],
                fleet: [],
                strategy: [],
            });
        }
        // Assign command tokens to command token allocations.
        for (const commandToken of commandTokens) {
            // Tokens owned by other players may be on another player's sheet.
            const playerSlot = this._find.closestOwnedCardHolderOwner(commandToken.getPosition());
            const commandTokenCounts = playerSlotToCommandTokenCounts.get(playerSlot);
            const commandSheet = playerSlotToCommandSheet.get(playerSlot);
            if (commandTokenCounts && commandSheet) {
                const worldPos = commandToken.getPosition();
                const localPos = commandSheet.worldPositionToLocal(worldPos);
                // Get the position of the token regions center.
                localPos.y -= 0.96;
                localPos.z = 0;
                const angle = (Math.atan2(localPos.y, localPos.x) * 180) / Math.PI;
                const dSq = localPos.magnitudeSquared();
                if (dSq <= CommandTokenCounter.ON_SHEET_DISTANCE_SQ) {
                    // Which region?
                    if (-30 < angle && angle <= 30) {
                        commandTokenCounts.tactic.push(commandToken);
                    }
                    else if (30 < angle && angle <= 90) {
                        commandTokenCounts.fleet.push(commandToken);
                    }
                    else if (90 < angle && angle <= 150) {
                        commandTokenCounts.strategy.push(commandToken);
                    }
                }
            }
        }
        return playerSlotToCommandTokenCounts;
    }
}
exports.CommandTokenCounter = CommandTokenCounter;
// Value that lets token be a little off sheet.
CommandTokenCounter.ON_SHEET_DISTANCE_SQ = 200;
//# sourceMappingURL=command-token-counter.js.map