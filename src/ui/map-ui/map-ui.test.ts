import { MockGameObject } from "ttpg-mock";
import { MapUI } from "./map-ui";

it("playerSlotToColorTileNumber", () => {
  expect(MapUI.playerSlotToColorTileNumber(0)).toBe(-100);
  expect(MapUI.playerSlotToColorTileNumber(1)).toBe(-101);
});

it("colorTileNumberToColor", () => {
  expect(MapUI.colorTileNumberToColor(-100)?.toString()).toBe(
    "(R=1,G=1,B=1,A=1)"
  );
});

it("colorTileNumberToColor (undefined)", () => {
  expect(MapUI.colorTileNumberToColor(-200)).toBeUndefined();
});

it("constructor", () => {
  MockGameObject.simple("tile.system:base/1");

  const mapUI = new MapUI(1, "1 2 -1 3 -101").setHexLabel("<1,0,-1>", "label");
  expect(mapUI).toBeDefined();
  expect(mapUI.getSize()).toBeDefined();
  expect(mapUI.getWidget()).toBeDefined();
});
