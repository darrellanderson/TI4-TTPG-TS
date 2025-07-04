import { MockGameObject } from "ttpg-mock";
import { MapUI } from "./map-ui";
import { HexType } from "ttpg-darrell";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

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

it("constructor, update", () => {
  const mapString: string = "1 2 -1 91 -101";
  const hexToLabel: Map<HexType, string> = new Map();
  const scale: number = 1;

  hexToLabel.set("<1,0,-1>", "label");
  const mapUI = new MapUI(mapString, hexToLabel, scale);
  expect(mapUI).toBeDefined();
  expect(mapUI.getSize()).toBeDefined();
  expect(mapUI.getWidget()).toBeDefined();

  const updatedHexToLabel: Map<HexType, string> = new Map();
  mapUI.update(mapString, updatedHexToLabel);
});
