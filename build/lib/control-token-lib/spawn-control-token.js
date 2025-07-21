"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnControlToken = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class SpawnControlToken {
    spawnControlToken(playerSlot) {
        const color = TI4.playerColor.getSlotPlasticColorOrThrow(playerSlot);
        const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
        if (color && faction) {
            const nsid = faction.getControlTokenNsid();
            const token = ttpg_darrell_1.Spawn.spawn(nsid);
            if (token) {
                token.setOwningPlayerSlot(playerSlot);
                token.setPrimaryColor(color);
            }
            return token;
        }
    }
    spawnControlTokenOrThrow(playerSlot) {
        const controlToken = this.spawnControlToken(playerSlot);
        if (!controlToken) {
            throw new Error(`spawnControlTokenOrThrow: no control token for player slot ${playerSlot}`);
        }
        return controlToken;
    }
}
exports.SpawnControlToken = SpawnControlToken;
//# sourceMappingURL=spawn-control-token.js.map