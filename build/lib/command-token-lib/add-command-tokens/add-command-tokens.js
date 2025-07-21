"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCommandTokens = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const player_seats_1 = require("../../player-lib/player-seats/player-seats");
const recycle_card_promissory_1 = require("../../recycle-lib/handlers/card/promissory/recycle-card-promissory");
class AddCommandTokens {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
        this._playerSeats = new player_seats_1.PlayerSeats();
        this._recycleCardPromissory = new recycle_card_promissory_1.RecycleCardPromissory();
    }
    getPlayerSlotToCommandTokenCount() {
        const slotToCount = new Map();
        // Seed each slot with 2.
        for (const seatEntry of this._playerSeats.getAllSeats()) {
            slotToCount.set(seatEntry.playerSlot, 2);
        }
        // "Versatile" faction ability adds a token.
        const slotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
        for (const [slot, faction] of slotToFaction) {
            if (faction.getAbilityNsids().includes("faction-ability:base/versatile")) {
                let count = slotToCount.get(slot);
                if (count !== undefined) {
                    count += 1;
                    slotToCount.set(slot, count);
                }
            }
        }
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            if (!this._cardUtil.isLooseCard(obj)) {
                continue;
            }
            const nsid = ttpg_darrell_1.NSID.get(obj);
            // Add one if "Hyper Metabolism" technology.
            if (nsid === "card.technology.green:base/hyper-metabolism") {
                const owner = this._find.closestOwnedCardHolderOwner(obj.getPosition());
                let count = slotToCount.get(owner);
                if (count !== undefined) {
                    count += 1;
                    slotToCount.set(owner, count);
                }
            }
            // Add one if "cybernetic enhancements" promissory.
            if (nsid.startsWith("card.promissory:") &&
                nsid.includes("/cybernetic-enhancements")) {
                const owner = this._find.closestOwnedCardHolderOwner(obj.getPosition());
                const faction = slotToFaction.get(owner);
                if (faction !== undefined &&
                    !faction.getPromissoryNsids().includes(nsid)) {
                    let count = slotToCount.get(owner);
                    if (count !== undefined) {
                        count += 1;
                        slotToCount.set(owner, count);
                    }
                    // Return card to the owner.
                    if (this._recycleCardPromissory.canRecycle(obj)) {
                        this._recycleCardPromissory.recycle(obj);
                    }
                }
            }
        }
        return slotToCount;
    }
    /**
     * Add command tokens for each player.
     *
     * @returns Set of player slots where not all tokens were added (too few).
     */
    addAllCommandTokens() {
        const tooFewTokens = new Set();
        const slotToCount = this.getPlayerSlotToCommandTokenCount();
        for (const [slot, count] of slotToCount) {
            const success = this.addCommandTokens(slot, count);
            if (!success) {
                tooFewTokens.add(slot);
            }
        }
        return tooFewTokens;
    }
    /**
     * Move command tokens from the container to above the command sheet.
     *
     * @param playerSlot
     * @param count
     * @returns
     */
    addCommandTokens(playerSlot, count) {
        let nsid;
        nsid = "container.token.command:base/generic";
        const skipContained = true;
        const container = this._find.findContainer(nsid, playerSlot, skipContained);
        if (!container) {
            return false;
        }
        nsid = "sheet:base/command";
        const sheet = this._find.findGameObject(nsid, playerSlot);
        if (!sheet) {
            return false;
        }
        let pos = new api_1.Vector(33, 16, 5);
        const commandTokens = container.getItems();
        let successCount = 0;
        for (let i = 0; i < count; i++) {
            const commandToken = commandTokens.shift();
            const showAnimation = false;
            const keep = false;
            if (commandToken !== undefined &&
                container.take(commandToken, pos, showAnimation, keep)) {
                commandToken.snapToGround();
                successCount++;
            }
            pos = pos.add([0, 2, 0]);
        }
        return successCount === count;
    }
}
exports.AddCommandTokens = AddCommandTokens;
//# sourceMappingURL=add-command-tokens.js.map