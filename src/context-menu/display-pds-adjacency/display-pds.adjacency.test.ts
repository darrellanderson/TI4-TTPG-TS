import { globalEvents, Player, Vector } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { DrawingLine, MockGameObject, MockPlayer } from "ttpg-mock";

import {
  ADJACENCY_ACTION_NAME,
  DisplayPDSAdjacency,
} from "./display-pds-adjacency";
import { SystemAdjacency } from "../../lib/system-lib/system-adjacency/system-adjacency";

it("init/destroy", () => {
  const displayPdsAdjacency = new DisplayPDSAdjacency();
  displayPdsAdjacency.init();
  displayPdsAdjacency.destroy();
});

it("obj before and after init", () => {
  MockGameObject.simple("unit:base/pds"); // before init
  new DisplayPDSAdjacency().init();
  MockGameObject.simple("unit:base/pds"); // after init
});

it("toggle on/off", () => {
  MockGameObject.simple("tile.system:base/1", {
    position: TI4.hex.toPosition("<0,0,0>"),
  });
  MockGameObject.simple("tile.system:base/2", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });
  const adj: Set<HexType> = new SystemAdjacency().getAdjHexes("<0,0,0>");
  expect(adj.has("<1,0,-1>")).toBe(true);

  globalEvents.onObjectCreated.clear(); // remove global DisplayPDSAdjacency
  const displayPdsAdjacency = new DisplayPDSAdjacency();
  displayPdsAdjacency.init();

  const pds: MockGameObject = MockGameObject.simple("unit:base/pds");

  expect(pds.getDrawingLines().length).toBe(0);
  const line = new DrawingLine();
  pds.addDrawingLine(line);
  expect(pds.getDrawingLines().length).toBe(1);
  pds.removeDrawingLineObject(line);
  expect(pds.getDrawingLines().length).toBe(0);

  // direct add/remove.
  expect(pds.getDrawingLines().length).toBe(0);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(false);
  displayPdsAdjacency._addAdjacencyLines(pds);
  expect(pds.getDrawingLines().length).toBe(1);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(true);
  displayPdsAdjacency._removeAdajecncyLines(pds);
  expect(pds.getDrawingLines().length).toBe(0);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(false);

  // toggle manually.
  expect(pds.getDrawingLines().length).toBe(0);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(false);
  displayPdsAdjacency._toggleAdjacencyLines(pds);
  expect(pds.getDrawingLines().length).toBe(1);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(true);
  displayPdsAdjacency._toggleAdjacencyLines(pds);
  expect(pds.getDrawingLines().length).toBe(0);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(false);

  // toggle using custom action.
  expect(pds.getDrawingLines().length).toBe(0);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(false);
  const player: Player = new MockPlayer();
  pds._customActionAsPlayer(player, ADJACENCY_ACTION_NAME);
  expect(pds.getDrawingLines().length).toBe(1);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(true);
  pds._customActionAsPlayer(player, ADJACENCY_ACTION_NAME);
  expect(pds.getDrawingLines().length).toBe(0);
  expect(displayPdsAdjacency._hasAdjacencyLines(pds)).toBe(false);
});

it("_parseAdjencyNodeOrThrow", () => {
  expect(() => DisplayPDSAdjacency._parseAdjencyNodeOrThrow("")).toThrow();

  let parsed: { hex: HexType; direction: string | undefined };
  parsed = DisplayPDSAdjacency._parseAdjencyNodeOrThrow("<0,0,0>");
  expect(parsed.hex).toBe("<0,0,0>");
  expect(parsed.direction).toBeUndefined();

  parsed = DisplayPDSAdjacency._parseAdjencyNodeOrThrow("<0,0,0>-n");
  expect(parsed.hex).toBe("<0,0,0>");
  expect(parsed.direction).toBe("n");
});

it("_getLinePoints", () => {
  const p1 = DisplayPDSAdjacency._getLinePoints(["<0,0,0>", "<1,0,-1>"]).map(
    (pos: Vector) => pos.toString()
  );
  expect(p1).toEqual(["(X=0,Y=0,Z=0)", "(X=15.01,Y=0,Z=0)"]);

  const p2 = DisplayPDSAdjacency._getLinePoints([
    "<0,0,0>",
    "<0,0,0>-n",
    "<0,0,0>-nw",
    "<0,0,0>-sw",
    "<0,0,0>-s",
    "<0,0,0>-se",
    "<0,0,0>-ne",
  ]).map((pos: Vector) => pos.toString());
  expect(p2).toEqual([
    "(X=0,Y=0,Z=0)",
    "(X=7.505,Y=0,Z=0)",
    "(X=3.752,Y=-6.5,Z=0)",
    "(X=-3.752,Y=-6.5,Z=0)",
    "(X=-7.505,Y=0,Z=0)",
    "(X=-3.752,Y=6.5,Z=0)",
    "(X=3.752,Y=6.5,Z=0)",
  ]);
});
