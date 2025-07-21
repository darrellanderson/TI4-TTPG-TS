"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceGenericHomeSystems = void 0;
const map_home_system_locations_1 = require("../../../lib/map-string-lib/map-home-system-locations/map-home-system-locations");
/**
 * This needs the player areas to be set up first, to get the correct player
 * seat order.
 */
class PlaceGenericHomeSystems {
    placeOrThrow() {
        const mapHomeSystemLocations = new map_home_system_locations_1.MapHomeSystemLocations();
        const playerSeats = TI4.playerSeats.getAllSeats();
        for (const playerSeat of playerSeats) {
            const playerSlot = playerSeat.playerSlot;
            mapHomeSystemLocations.findOrSpawnGenericHomeSystemOrThrow(playerSlot);
        }
    }
}
exports.PlaceGenericHomeSystems = PlaceGenericHomeSystems;
//# sourceMappingURL=place-generic-home-systems.js.map