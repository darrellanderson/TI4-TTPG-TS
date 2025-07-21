"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapHomeSystemLocations = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
// "Standard" home system locations, and suggested off-map positions keeping
// closer to the center of the table but pushed out (north and south).  The
// idea is to leave the long ends clear for other use.
const HEX = {
    N: { onMap: "<3,0,-3>", offMap: "<5,0,-5>" },
    NE: { onMap: "<0,3,-3>", offMap: "<2,3,-5>" },
    SE: { onMap: "<-3,3,0>", offMap: "<-5,3,2>" },
    S: { onMap: "<-3,0,3>", offMap: "<-5,0,5>" },
    SW: { onMap: "<0,-3,3>", offMap: "<-2,-3,5>" },
    NW: { onMap: "<3,-3,0>", offMap: "<5,-3,-2>" },
};
const HOME_SYSTEM_POSITIONS = {
    1: [HEX.S],
    2: [HEX.S, HEX.N],
    3: [HEX.S, HEX.NW, HEX.NE],
    4: [HEX.SE, HEX.SW, HEX.NW, HEX.NE],
    5: [HEX.SE, HEX.SW, HEX.NW, HEX.N, HEX.NE],
    6: [HEX.SE, HEX.S, HEX.SW, HEX.NW, HEX.N, HEX.NE],
    7: [
        // this is the rulebook funky shape
        HEX.SE,
        { onMap: "<-4,0,4>", offMap: "<-6,0,6>" }, // red
        { onMap: "<-1,-3,4>", offMap: "<-3,-3,6>" },
        { onMap: "<2,-4,2>", offMap: "<4,-5,1>" }, // pink
        { onMap: "<4,-3,-1>", offMap: "<6,-3,-3>" }, // yellow
        { onMap: "<4,0,-4>", offMap: "<6,0,-6>" }, // blue
        HEX.NE,
    ],
    // 7: [
    //     // home systems in corners (better milty draft behavior, still needs intervention)
    //     { onMap: "<-4,3,1>", offMap: "<-6,3,3>" },
    //     { onMap: "<-4,0,4>", offMap: "<-6,0,6>" },
    //     { onMap: "<-1,-3,4>", offMap: "<-3,-3,6>" },
    //     { onMap: "<2,-4,2>", offMap: "<2,-6,4>" },
    //     { onMap: "<4,-3,-1>", offMap: "<4,-5,1>" },
    //     { onMap: "<1,3,-4>", offMap: "<3,3,-6>" },
    //     { onMap: "<-2,4,-2>", offMap: "<2,4,-6>" },
    // ],
    8: [
        { onMap: "<-4,3,1>", offMap: "<-6,3,3>" },
        { onMap: "<-4,0,4>", offMap: "<-6,0,6>" }, // yellow
        { onMap: "<-1,-3,4>", offMap: "<-3,-3,6>" },
        { onMap: "<2,-4,2>", offMap: "<2,-6,4>" }, // orange
        { onMap: "<4,-3,-1>", offMap: "<4,-5,1>" }, // pink
        { onMap: "<4,0,-4>", offMap: "<6,0,-6>" }, // blue
        { onMap: "<1,3,-4>", offMap: "<3,3,-6>" },
        { onMap: "<-2,4,-2>", offMap: "<2,4,-6>" },
    ],
};
class MapHomeSystemLocations {
    constructor() { }
    get(playerSlot) {
        const playerSeats = TI4.playerSeats.getAllSeats();
        const playerCount = playerSeats.length;
        const z = api_1.world.getTableHeight() + 10;
        let seatIndex = -1;
        playerSeats.forEach((playerSeat, index) => {
            if (playerSeat.playerSlot === playerSlot) {
                seatIndex = index;
            }
        });
        if (seatIndex >= 0) {
            const hexesArray = HOME_SYSTEM_POSITIONS[playerCount];
            if (hexesArray) {
                const hexesEntry = hexesArray[seatIndex];
                if (hexesEntry) {
                    const hex = hexesEntry.onMap;
                    const pos = TI4.hex.toPosition(hex);
                    pos.z = z;
                    return pos;
                }
            }
        }
        return undefined;
    }
    findExistingGenericHomeSystem(playerSlot) {
        const nsid = "tile.system:base/0";
        const skipContained = true;
        return new ttpg_darrell_1.Find().findGameObject(nsid, playerSlot, skipContained);
    }
    spawnGenericHomeSystem(playerSlot) {
        const nsid = "tile.system:base/0";
        const pos = this.get(playerSlot);
        if (pos) {
            const obj = ttpg_darrell_1.Spawn.spawn(nsid, pos);
            const color = TI4.playerColor.getSlotPlasticColor(playerSlot);
            if (obj && color) {
                obj.setName(`Home System (placeholder)`);
                obj.setOwningPlayerSlot(playerSlot);
                obj.setPrimaryColor(color);
                obj.snapToGround();
                return obj;
            }
        }
        return undefined;
    }
    findOrSpawnGenericHomeSystemOrThrow(playerSlot) {
        const existingObj = this.findExistingGenericHomeSystem(playerSlot);
        if (existingObj) {
            return existingObj;
        }
        const newObj = this.spawnGenericHomeSystem(playerSlot);
        if (newObj) {
            return newObj;
        }
        throw new Error(`Failed to find or spawn home system for player slot ${playerSlot}`);
    }
}
exports.MapHomeSystemLocations = MapHomeSystemLocations;
//# sourceMappingURL=map-home-system-locations.js.map