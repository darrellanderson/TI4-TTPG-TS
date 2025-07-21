"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceControlTokenOnCard = void 0;
const api_1 = require("@tabletop-playground/api");
const spawn_control_token_1 = require("./spawn-control-token");
/**
 * Use a deterministic layout following player seating.
 */
class PlaceControlTokenOnCard {
    constructor() {
        this._spawnControlToken = new spawn_control_token_1.SpawnControlToken();
    }
    _computePos(center, playerSlot) {
        const playerSeats = TI4.playerSeats.getAllSeats();
        const playerIndex = playerSeats.findIndex((playerSeat) => {
            return playerSeat.playerSlot === playerSlot;
        });
        if (playerIndex === -1) {
            // Unknown player, use the center position.
            return center.add([0, 0, 10]);
        }
        const playerCount = playerSeats.length;
        const numRows = Math.ceil(playerCount / 2);
        let col = 0;
        let row = numRows - 1 - playerIndex;
        if (row < 0) {
            row = numRows - 1 - (numRows + row); // swap order
            col = 1;
        }
        // Make relative to center of score slot.
        row -= (numRows - 1) / 2;
        col -= 0.5;
        const y = center.y - col * 3;
        const x = center.x - row * 2.3;
        const z = api_1.world.getTableHeight() + 10;
        return new api_1.Vector(x, y, z);
    }
    place(card, playerSlot) {
        const color = TI4.playerColor.getSlotPlasticColor(playerSlot);
        if (color) {
            const controlToken = this._spawnControlToken.spawnControlToken(playerSlot);
            if (controlToken) {
                const dst = this._computePos(card.getPosition(), playerSlot);
                controlToken.setOwningPlayerSlot(playerSlot);
                controlToken.setPosition(dst);
                controlToken.setPrimaryColor(color);
                controlToken.setTags([`control(${playerSlot})`]);
                controlToken.snapToGround();
                return true;
            }
        }
        return false;
    }
}
exports.PlaceControlTokenOnCard = PlaceControlTokenOnCard;
//# sourceMappingURL=place-control-token-on-card.js.map