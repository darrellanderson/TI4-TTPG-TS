"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroHelioCommandArray = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const return_command_tokens_1 = require("../../../lib/command-token-lib/return-command-tokens/return-command-tokens");
const right_click_purge_1 = require("../../right-click-purge/right-click-purge");
/**
 * Sol hero Jace X. 4th Air Legion
 *
 * ACTION: Remove each of your command tokens from the game board and return
 * them to your reinforcements.
 *
 * Then, purge this card.
 */
class HeroHelioCommandArray extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const cardNsidPrefix = "card.leader.hero:pok/jace-x-4th-air-legion";
        const customActionName = "*Helio Command Array";
        const customActionHandler = (object, player, identifier) => {
            if (identifier === customActionName) {
                this._helioCommandArray(object, player.getSlot());
            }
        };
        super(cardNsidPrefix, customActionName, customActionHandler);
    }
    _helioCommandArray(object, playerSlot) {
        const playerName = TI4.playerName.getBySlot(playerSlot);
        const color = api_1.world.getSlotColor(playerSlot);
        const msg = `${playerName} executing Helio Command Array!`;
        ttpg_darrell_1.Broadcast.chatAll(msg, color);
        new return_command_tokens_1.ReturnCommandTokens().returnOnePlayersCommandTokens(playerSlot);
        new right_click_purge_1.RightClickPurge()._purge(object, playerSlot);
    }
}
exports.HeroHelioCommandArray = HeroHelioCommandArray;
//# sourceMappingURL=hero-helio-command-array.js.map