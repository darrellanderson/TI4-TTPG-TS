import { MockGameObject } from "ttpg-mock";
import { SystemAdjacencyHyperlane } from "./system-adjacency-hyperlane";
import { Hex, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { GameObject } from "@tabletop-playground/api";
import exp from "constants";

it("static yawToShift", () => {
  // Round to nearest 60 degrees.
  expect(SystemAdjacencyHyperlane.yawToShift(-1)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(0)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(1)).toBe(0);

  expect(SystemAdjacencyHyperlane.yawToShift(59)).toBe(1);
  expect(SystemAdjacencyHyperlane.yawToShift(60)).toBe(1);
  expect(SystemAdjacencyHyperlane.yawToShift(61)).toBe(1);

  expect(SystemAdjacencyHyperlane.yawToShift(359)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(360)).toBe(0);
  expect(SystemAdjacencyHyperlane.yawToShift(361)).toBe(0);
});

it("static neighborsWithRotAndFlip", () => {
  const defaultNeighbors: Array<HexType> = Hex.neighbors("<0,0,0>");
  let neighbors: Array<HexType>;

  const systemTileObj: GameObject = new MockGameObject();
  const system: System = new System(
    systemTileObj,
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1 }
  );
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[0]);

  systemTileObj.setRotation([0, 60, 0]);
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[5]);

  systemTileObj.setRotation([0, 60, -180]);
  neighbors = SystemAdjacencyHyperlane.neighborsWithRotAndFlip(
    "<0,0,0>",
    system
  );
  expect(neighbors[0]).toEqual(defaultNeighbors[1]);
});
