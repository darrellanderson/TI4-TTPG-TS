import { MockGameObject } from "ttpg-mock";
import { BagDraftSimple } from "./bag-draft-simple";
import { SliceTiles } from "../generate-slices/generate-slices";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of globalThis.TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      globalThis.TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

it("draft", () => {
  const bagDraft: BagDraftSimple = new BagDraftSimple();
  expect(bagDraft.isEnabled()).toBe(true);
  expect(bagDraft.getDraftName()).toBe("Bag Draft");
  expect(bagDraft.getGenerateSlicesParams()).toBeDefined();
  expect(() => {
    bagDraft.createEmptyDraftState("@test/test");
  }).toThrow();
});

it("_getSlices", () => {
  const bagDraft: BagDraftSimple = new BagDraftSimple();
  const slices: Array<SliceTiles> = bagDraft._getSlices();
  expect(slices).toBeDefined();
  expect(slices.length).toBeGreaterThan(0);
});
