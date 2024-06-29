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
