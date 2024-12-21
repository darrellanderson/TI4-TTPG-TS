import { MockGameObject } from "ttpg-mock";
import { AbstractDraft, CreateDraftParams } from "./abstract-draft";
import { Milty, MILTY_SLICE_SHAPE, MILTY_SLICE_SHAPE_ALT } from "./milty";
import { DraftState } from "../draft-state/draft-state";

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
  new Milty();
});

it("getGenerateSlicesParams", () => {
  const milty = new Milty();
  const generateSlicesParams = milty.getGenerateSlicesParams();
  expect(generateSlicesParams).toBeDefined();
});

it("createDraftEmptyState", () => {
  let abstractDraft: AbstractDraft | undefined;
  let draftState: DraftState | undefined;

  abstractDraft = new Milty();
  draftState = abstractDraft.createEmptyDraftState("@test/milty");
  expect(draftState).toBeDefined();

  expect(draftState.getSliceShape(-1)).toEqual(MILTY_SLICE_SHAPE);

  TI4.config.setPlayerCount(7);
  abstractDraft = new Milty();
  draftState = abstractDraft.createEmptyDraftState("@test/milty");
  expect(draftState.getSliceShape(-1)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(0)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(1)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(2)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(3)).toEqual(MILTY_SLICE_SHAPE_ALT);
  expect(draftState.getSliceShape(4)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(5)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(6)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(7)).toEqual(MILTY_SLICE_SHAPE);

  TI4.config.setPlayerCount(8);
  abstractDraft = new Milty();
  draftState = abstractDraft.createEmptyDraftState("@test/milty");
  expect(draftState).toBeDefined();
  expect(draftState.getSliceShape(0)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(1)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(2)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(3)).toEqual(MILTY_SLICE_SHAPE_ALT);
  expect(draftState.getSliceShape(4)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(5)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(6)).toEqual(MILTY_SLICE_SHAPE);
  expect(draftState.getSliceShape(7)).toEqual(MILTY_SLICE_SHAPE_ALT);
});

it("createDraftState", () => {
  TI4.config.setPlayerCount(2);
  const createDraftParams: CreateDraftParams = {
    namespaceId: "@test/milty",
    numSlices: 3,
    numFactions: 3,
    config: "&labels=a",
  };

  const milty = new Milty();
  const errors: Array<string> = [];
  const draftState = milty.createDraftState(createDraftParams, errors);
  expect(draftState).toBeDefined();
  expect(errors).toEqual([]);
});
