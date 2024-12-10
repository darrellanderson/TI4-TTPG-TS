import { Color, MockGameObject } from "ttpg-mock";
import { SliceUI } from "./slice-ui";
import { HexType } from "ttpg-darrell";
import { UI_SIZE } from "../../abstract-ui/abtract-ui";

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

it("size", () => {
  const slice: Array<number> = [19, 91];
  const sliceShape: Array<HexType> = ["<0,0,0>", "<1,0,-1>", "<1,0,-1>"];
  const color: Color = new Color(0.5, 0.5, 0.5, 1);
  const sliceUi = new SliceUI(slice, sliceShape, color, 1);
  const size: UI_SIZE = sliceUi.getSize();
  expect(size.w).toBeGreaterThan(0);
  expect(size.h).toBeGreaterThan(0);
});

it("getWidget", () => {
  const slice: Array<number> = [19, 20];
  const sliceShape: Array<HexType> = ["<0,0,0>", "<1,0,-1>", "<1,0,-1>"];
  const color: Color = new Color(0.5, 0.5, 0.5, 1);
  const sliceUi = new SliceUI(slice, sliceShape, color, 1);
  const widget = sliceUi.getWidget();
  expect(widget).toBeDefined();
});

it("setLabel", () => {
  const slice: Array<number> = [19, 20];
  const sliceShape: Array<HexType> = ["<0,0,0>", "<1,0,-1>", "<1,0,-1>"];
  const color: Color = new Color(0.5, 0.5, 0.5, 1);
  const sliceUi = new SliceUI(slice, sliceShape, color, 1);

  // Use varying label lengths to test different number of lines.
  for (let i = 0; i < 100; i++) {
    const label: string = "x ".repeat(i);
    sliceUi.setLabel(label);
  }
});
