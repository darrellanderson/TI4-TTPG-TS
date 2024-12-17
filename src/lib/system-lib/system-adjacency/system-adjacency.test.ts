import { Vector } from "@tabletop-playground/api";
import { AdjacencyNodeType, AdjacencyPathType, HexType } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";

import { System } from "../system/system";
import { SystemAdjacency } from "./system-adjacency";

it("static getHexToSystem", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/1" });

  const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
  const system: System | undefined = hexToSystem.get("<0,0,0>");
  expect(system?.getSystemTileNumber()).toBe(1);
});

it("static simplifyPath", () => {
  const path: AdjacencyPathType = {
    node: "d",
    distance: 0,
    path: [
      { src: "a", dst: "b", distance: 0, isTransit: false },
      { src: "b", dst: "c", distance: 0, isTransit: false },
      { src: "c", dst: "d", distance: 0, isTransit: false },
    ],
  };
  const simplified: Array<AdjacencyNodeType> =
    SystemAdjacency.simplifyPath(path);
  expect(simplified).toEqual(["a", "b", "c", "d"]);
});

it("static adjNodeToPositionOrThrow (hex)", () => {
  const pos: Vector = SystemAdjacency.adjNodeToPositionOrThrow("<0,0,0>");
  expect(pos.toString()).toBe("(X=0,Y=0,Z=0)");
});

it("static adjNodeToPositionOrThrow (edge)", () => {
  const a: Vector = TI4.hex.toPosition("<0,0,0>");
  const b: Vector = TI4.hex.toPosition("<1,0,-1>");
  const mid: Vector = a.add(b).divide(2);

  const edge: string = "<0,0,0>|<1,0,-1>";
  const pos: Vector = SystemAdjacency.adjNodeToPositionOrThrow(edge);
  expect(pos.toString()).toBe(mid.toString());
});

it("static adjNodeToPositionOrThrow (throw)", () => {
  expect(() => {
    SystemAdjacency.adjNodeToPositionOrThrow("invalid");
  }).toThrow();
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
