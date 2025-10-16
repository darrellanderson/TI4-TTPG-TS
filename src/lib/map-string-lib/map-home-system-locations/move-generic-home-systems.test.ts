import { MapHomeSystemLocations } from "./map-home-system-locations";
import { GameObject } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { MockCardHolder } from "ttpg-mock";
import { MapStringLoad } from "../map-string/map-string-load";
import { MoveGenericHomeSystemLocations } from "./move-generic-home-systems";

beforeEach(() => {
  for (let playerSlot = 10; playerSlot < 16; playerSlot++) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }
});

it("move", () => {
  const hsLocs = new MapHomeSystemLocations();
  const hsObjs: Array<GameObject> = [];
  for (let playerSlot = 10; playerSlot < 16; playerSlot++) {
    const obj: GameObject | undefined =
      hsLocs.spawnGenericHomeSystem(playerSlot);
    if (!obj) {
      throw new Error(
        `failed to spawn generic home system for slot ${playerSlot}`
      );
    }
    hsObjs.push(obj);
  }
  expect(hsObjs.length).toBe(6);

  let hexes: Array<HexType>;
  hexes = hsObjs.map((obj: GameObject): HexType => {
    return TI4.hex.fromPosition(obj.getPosition());
  });
  expect(hexes).toEqual([
    "<-3,3,0>",
    "<-3,0,3>",
    "<0,-3,3>",
    "<3,-3,0>",
    "<3,0,-3>",
    "<0,3,-3>",
  ]);

  // Try a map string with non-standard home positions.
  const mapString: string =
    "98 115 100 116 99 97 37 104 36 21 69 64 47 26 110 42 39 106 40 0 114 102 0 46 101 0 43 103 0 60 113 0 19 108 0 117 901B0 902B0 903B0 904B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 905B0 906B0 900B0";

  new MapStringLoad().load(mapString);
  const mover = new MoveGenericHomeSystemLocations();

  expect(mover._getOpenHexes(mapString)).toEqual([
    "<2,1,-3>",
    "<-1,3,-2>",
    "<-3,2,1>",
    "<-2,-1,3>",
    "<1,-3,2>",
    "<3,-2,-1>",
  ]);

  mover.moveGenerics(mapString);

  hexes = hsObjs.map((obj: GameObject): HexType => {
    return TI4.hex.fromPosition(obj.getPosition());
  });
  expect(hexes).toEqual([
    "<-3,2,1>",
    "<-2,-1,3>",
    "<1,-3,2>",
    "<3,-2,-1>",
    "<2,1,-3>",
    "<-1,3,-2>",
  ]);
});
