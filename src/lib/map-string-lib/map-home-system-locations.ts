import { Color, GameObject, Vector, world } from "@tabletop-playground/api";
import { PlayerSeatType } from "lib/player-lib/player-seats/player-seats";
import { Find, HexType, Spawn } from "ttpg-darrell";

type HomeSystemDir = "N" | "NE" | "SE" | "S" | "SW" | "NW";
type HomeSystemHexes = {
  onMap: HexType;
  offMap: HexType;
};

// "Standard" home system locations, and suggested off-map positions keeping
// closer to the center of the table but pushed out (north and south).  The
// idea is to leave the long ends clear for other use.
const HEX: Record<HomeSystemDir, HomeSystemHexes> = {
  N: { onMap: "<3,0,-3>", offMap: "<5,0,-5>" },
  NE: { onMap: "<0,3,-3>", offMap: "<2,3,-5>" },
  SE: { onMap: "<-3,3,0>", offMap: "<-5,3,2>" },
  S: { onMap: "<-3,0,3>", offMap: "<-5,0,5>" },
  SW: { onMap: "<0,-3,3>", offMap: "<-2,-3,5>" },
  NW: { onMap: "<3,-3,0>", offMap: "<5,-3,-2>" },
};

const HOME_SYSTEM_POSITIONS: Record<number, Array<HomeSystemHexes>> = {
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

export class MapHomeSystemLocations {
  constructor() {}

  get(playerSlot: number): Vector | undefined {
    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const playerCount: number = playerSeats.length;
    const z: number = world.getTableHeight() + 10;

    let seatIndex: number = -1;
    playerSeats.forEach((playerSeat, index) => {
      if (playerSeat.playerSlot === playerSlot) {
        seatIndex = index;
      }
    });
    if (seatIndex >= 0) {
      const hexesArray: Array<HomeSystemHexes> | undefined =
        HOME_SYSTEM_POSITIONS[playerCount];
      if (hexesArray) {
        const hexesEntry: HomeSystemHexes | undefined = hexesArray[seatIndex];
        if (hexesEntry) {
          const hex: HexType = hexesEntry.onMap;
          const pos: Vector = TI4.hex.toPosition(hex);
          pos.z = z;
          return pos;
        }
      }
    }
    return undefined;
  }

  findExistingGenericHomeSystem(playerSlot: number): GameObject | undefined {
    const nsid: string = "tile.system:base/0";
    const skipContained: boolean = true;
    return new Find().findGameObject(nsid, playerSlot, skipContained);
  }

  spawnGenericHomeSystem(playerSlot: number): GameObject | undefined {
    const nsid: string = "tile.system:base/0";
    const pos: Vector | undefined = this.get(playerSlot);
    if (pos) {
      const obj: GameObject | undefined = Spawn.spawn(nsid, pos);
      const color: Color | undefined =
        TI4.playerColor.getSlotPlasticColor(playerSlot);

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

  findOrSpawnGenericHomeSystemOrThrow(playerSlot: number): GameObject {
    const existingObj: GameObject | undefined =
      this.findExistingGenericHomeSystem(playerSlot);
    if (existingObj) {
      return existingObj;
    }

    const newObj: GameObject | undefined =
      this.spawnGenericHomeSystem(playerSlot);
    if (newObj) {
      return newObj;
    }

    throw new Error(
      `Failed to find or spawn home system for player slot ${playerSlot}`
    );
  }
}
