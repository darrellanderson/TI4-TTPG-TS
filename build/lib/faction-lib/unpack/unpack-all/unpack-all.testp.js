"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const abstract_unpack_testp_1 = require("../abstract-unpack/abstract-unpack.testp");
const unpack_all_1 = require("./unpack-all");
new abstract_unpack_testp_1.AbstractUnpackTestP(new unpack_all_1.UnpackAll(abstract_unpack_testp_1.FACTION, abstract_unpack_testp_1.PLAYER_SLOT));
api_1.refObject.addCustomAction("*Cycle All");
api_1.refObject.onCustomAction.add((_obj, player, identifier) => {
    if (identifier === "*Cycle All") {
        const factions = TI4.factionRegistry.getAllFactions();
        let unpack = undefined;
        const runnable = () => {
            if (unpack) {
                player.sendChatMessage("remove " + unpack.getFaction().getName(), [1, 1, 1, 1]);
                unpack.remove();
                unpack = undefined;
                setTimeout(runnable, 500);
            }
            else {
                const faction = factions.shift();
                if (faction) {
                    console.log("CYCLE ALL", faction.getName());
                    unpack = new unpack_all_1.UnpackAll(faction, abstract_unpack_testp_1.PLAYER_SLOT);
                    player.sendChatMessage("unpack " + unpack.getFaction().getName(), [1, 1, 1, 1]);
                    unpack.unpack();
                    setTimeout(runnable, 500);
                }
            }
        };
        process.nextTick(runnable);
    }
});
//# sourceMappingURL=unpack-all.testp.js.map