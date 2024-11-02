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
  const size = slice.getSize();
  expect(size.w).toBeGreaterThan(0);
  expect(size.h).toBeGreaterThan(0);
});

it("getWidget", () => {
  const slice = new SliceUI(1, ["<0,0,0>", "<1,0,-1>"]);
  const widget = slice.getWidget([19]);
  expect(widget).toBeDefined();
});
