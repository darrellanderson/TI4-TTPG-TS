import { Color, GameObject, Vector } from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";

import { MapHomeSystemLocations } from "../../../lib/map-string-lib/map-home-system-locations";
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";

/**
 * This needs the player areas to be set up first, to get the correct player
 * seat order.
 */
export class PlaceGenericHomeSystems {
  public placeOrThrow(): boolean {
    const playerSlotToPos: Map<number, Vector> = new Map();

    // Get all positions before spawning anything.
    const mapHomeSystemLocations: MapHomeSystemLocations =
      new MapHomeSystemLocations();
    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    for (const playerSeat of playerSeats) {
      const pos: Vector | undefined = mapHomeSystemLocations.get(
        playerSeat.playerSlot
      );
      if (!pos) {
        throw new Error(
          `Failed to get home system position for player slot ${playerSeat.playerSlot}`
        );
      }
      playerSlotToPos.set(playerSeat.playerSlot, pos);
    }

    for (const [playerSlot, pos] of playerSlotToPos) {
      const obj: GameObject = Spawn.spawnOrThrow("tile.system:base/0", pos);

      obj.setOwningPlayerSlot(playerSlot);
      obj.snapToGround();

      const color: Color =
        TI4.playerColor.getSlotPlasticColorOrThrow(playerSlot);
      obj.setPrimaryColor(color);

      obj.setName(`Home System (placeholder)`);
    }

    return true;
  }
}
