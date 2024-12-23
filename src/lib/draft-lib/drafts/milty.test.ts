import { Milty, MILTY_SLICE_SHAPE, MILTY_SLICE_SHAPE_ALT } from "./milty";
import { DraftState } from "../draft-state/draft-state";
import { IDraft } from "./idraft";

it("constructor", () => {
  new Milty();
});

it("getGenerateSlicesParams", () => {
  const milty = new Milty();
  const generateSlicesParams = milty.getGenerateSlicesParams();
  expect(generateSlicesParams).toBeDefined();
});

it("createDraftEmptyState", () => {
  let draft: IDraft | undefined;
  let draftState: DraftState | undefined;

  draft = new Milty();
  draftState = draft.createEmptyDraftState("@test/milty");
  expect(draftState).toBeDefined();

  expect(draftState.getSliceShape(-1)).toEqual(MILTY_SLICE_SHAPE);

  TI4.config.setPlayerCount(7);
  draft = new Milty();
  draftState = draft.createEmptyDraftState("@test/milty");
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
  draft = new Milty();
  draftState = draft.createEmptyDraftState("@test/milty");
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
