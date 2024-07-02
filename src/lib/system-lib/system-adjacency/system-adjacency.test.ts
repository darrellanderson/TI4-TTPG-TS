import { HexType } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";

import { System } from "../system/system";
import { SystemAdjacency } from "./system-adjacency";

it("static getHexToSystem", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/1" });

  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  const system: System | undefined = hexToSystem.get("<0,0,0>");
  expect(system?.getSystemTileNumber()).toBe(1);
});

it("getAdjHexes", () => {
  new MockGameObject({
    templateMetadata: "tile.system:base/1",
    position: TI4.hex.toPosition("<0,0,0>"),
  });
  new MockGameObject({
    templateMetadata: "tile.system:base/2",
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  new MockGameObject({
    templateMetadata: "tile.system:base/3",
    position: TI4.hex.toPosition("<2,0,-2>"),
  });

  const adjHexes: Set<HexType> = new SystemAdjacency().getAdjHexes("<0,0,0>");
  const asArray: Array<HexType> = Array.from(adjHexes);
  expect(asArray).toEqual(["<1,0,-1>"]);
});
