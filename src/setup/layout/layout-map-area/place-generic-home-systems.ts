import { MapHomeSystemLocations } from "../../../lib/map-string-lib/map-home-system-locations/map-home-system-locations";
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";

/**
 * This needs the player areas to be set up first, to get the correct player
 * seat order.
 */
export class PlaceGenericHomeSystems {
  public placeOrThrow(): void {
    const mapHomeSystemLocations: MapHomeSystemLocations =
      new MapHomeSystemLocations();
    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    for (const playerSeat of playerSeats) {
      const playerSlot: number = playerSeat.playerSlot;
      mapHomeSystemLocations.findOrSpawnGenericHomeSystemOrThrow(playerSlot);
    }
  }
}
