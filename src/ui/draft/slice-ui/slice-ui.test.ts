import { MockGameObject } from "ttpg-mock";
import { SliceUI } from "./slice-ui";

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
  const slice = new SliceUI(1, ["<0,0,0>"]);
  expect(slice.getWidth()).toBe(120);
  expect(slice.getHeight()).toBe(104);
});

it("getWidget", () => {
  const slice = new SliceUI(1, ["<0,0,0>"]);
  const widget = slice.getWidget([1]);
  expect(widget).toBeDefined();
});
