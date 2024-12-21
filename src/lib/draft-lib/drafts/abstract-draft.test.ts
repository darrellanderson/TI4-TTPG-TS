import { NamespaceId } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { GenerateSlicesParams } from "../generate-slices/generate-slices";
import { AbstractDraft, CreateDraftParams } from "./abstract-draft";
import { MockGameObject } from "ttpg-mock";

class MyAbstractDraft extends AbstractDraft {
  getGenerateSlicesParams(): GenerateSlicesParams {
    return { sliceMakeup: ["high"], sliceShape: ["<0,0,0>", "<1,0,-1>"] };
  }
  createEmptyDraftState(namespaceId: NamespaceId): DraftState {
    return new DraftState(namespaceId);
  }
  constructor() {
    super();
  }
}

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

it("constructor", () => {
  new MyAbstractDraft();
});

it("getGenerateSlicesParams", () => {
  const draft: MyAbstractDraft = new MyAbstractDraft();
  expect(draft.getGenerateSlicesParams()).toEqual({
    sliceMakeup: ["high"],
    sliceShape: ["<0,0,0>", "<1,0,-1>"],
  });
});

it("createEmptyDraftState", () => {
  const draft: MyAbstractDraft = new MyAbstractDraft();
  const namespaceId: NamespaceId = "@test/test";
  expect(draft.createEmptyDraftState(namespaceId)).toBeDefined();
});

it("createDraftState", () => {
  const draft: MyAbstractDraft = new MyAbstractDraft();
  const params: CreateDraftParams = {
    namespaceId: "@test/test",
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const errors: Array<string> = [];
  const draftState: DraftState = draft.createDraftState(params, errors);
  expect(draftState).toBeDefined();
  expect(errors).toEqual([]);
});
