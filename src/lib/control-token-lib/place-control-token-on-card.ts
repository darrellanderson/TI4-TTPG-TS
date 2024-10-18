import {
  Card,
  Color,
  GameObject,
  Vector,
  world,
} from "@tabletop-playground/api";

import { PlayerSeatType } from "../player-lib/player-seats/player-seats";
import { SpawnControlToken } from "./spawn-control-token";

/**
 * Use a deterministic layout following player seating.
 */
export class PlaceControlTokenOnCard {
  _spawnControlToken: SpawnControlToken = new SpawnControlToken();

  _computePos(center: Vector, playerSlot: number): Vector {
    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const playerIndex: number = playerSeats.findIndex((playerSeat) => {
      return playerSeat.playerSlot === playerSlot;
    });
    if (playerIndex === -1) {
      // Unknown player, use the center position.
      return center.add([0, 0, 10]);
    }

    const playerCount = playerSeats.length;
    const numRows = Math.ceil(playerCount / 2);

    let col: number = 0;
    let row: number = numRows - 1 - playerIndex;
    if (row < 0) {
      row = numRows - 1 - (numRows + row); // swap order
      col = 1;
    }

    // Make relative to center of score slot.
    row -= (numRows - 1) / 2;
    col -= 0.5;

    const y: number = center.y - col * 3;
    const x: number = center.x - row * 2.3;
    const z: number = world.getTableHeight() + 10;
    return new Vector(x, y, z);
  }

  place(card: Card, playerSlot: number): boolean {
    const color: Color | undefined =
      TI4.playerColor.getSlotPlasticColor(playerSlot);
    if (color) {
      const controlToken: GameObject | undefined =
        this._spawnControlToken.spawnControlToken(playerSlot);
      if (controlToken) {
        const dst: Vector = this._computePos(card.getPosition(), playerSlot);
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
