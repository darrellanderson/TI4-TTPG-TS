"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerLeaders = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorPlayerLeaders {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
            let agentActive = true;
            let commanderActive = true;
            let heroActive = true;
            const owningPlayerSlot = undefined;
            const skipContained = true;
            if (faction) {
                // Agent
                const agentNsids = faction.getAgentNsids();
                for (const nsid of agentNsids) {
                    const card = this._find.findCard(nsid, owningPlayerSlot, skipContained);
                    if (card && !card.isFaceUp()) {
                        agentActive = false;
                    }
                }
                // Commander
                const commanderNsids = faction.getCommanderNsids();
                for (const nsid of commanderNsids) {
                    const card = this._find.findCard(nsid, owningPlayerSlot, skipContained);
                    if (card && !card.isFaceUp()) {
                        commanderActive = false;
                    }
                }
                // Hero
                const heroNsids = faction.getHeroNsids();
                for (const nsid of heroNsids) {
                    const card = this._find.findCard(nsid, owningPlayerSlot, skipContained);
                    if (card && !card.isFaceUp()) {
                        heroActive = false;
                    }
                }
            }
            player.leaders = {
                agent: agentActive ? "unlocked" : "locked",
                commander: commanderActive ? "unlocked" : "locked",
                hero: heroActive ? "unlocked" : "locked",
            };
        });
    }
}
exports.UpdatorPlayerLeaders = UpdatorPlayerLeaders;
//# sourceMappingURL=updator-player-leaders.js.map