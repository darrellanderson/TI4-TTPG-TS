import { DraftState } from "../draft-state/draft-state";
import { IDraft } from "./idraft";
import {
  Wekker,
  WEKKER_SLICE_SHAPE,
  WEKKER_SLICE_SHAPE_L,
  WEKKER_SLICE_SHAPE_R,
} from "./wekker";

it("constructor", () => {
  new Wekker();
});

it("isEnabled", () => {
  const wekker = new Wekker();
  expect(wekker.isEnabled()).toBe(true);
});

it("getDraftName", () => {
  const wekker = new Wekker();
  const draftName = wekker.getDraftName();
  expect(draftName).toEqual("Wekker Draft");
});

it("getGenerateSlicesParams", () => {
  const wekker = new Wekker();
  const generateSlicesParams = wekker.getGenerateSlicesParams();
  expect(generateSlicesParams).toBeDefined();
});

it("createDraftEmptyState", () => {
  let draft: IDraft | undefined;
  let draftState: DraftState | undefined;

  draft = new Wekker();
  draftState = draft.createEmptyDraftState("@test/wekker");
  expect(draftState).toBeDefined();

  expect(draftState.getSliceShape(-1)).toEqual(WEKKER_SLICE_SHAPE);

  TI4.config.setPlayerCount(7);
  draft = new Wekker();
  draftState = draft.createEmptyDraftState("@test/wekker");
  expect(draftState.getSliceShape(-1)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(0)).toEqual(WEKKER_SLICE_SHAPE_R);
  expect(draftState.getSliceShape(1)).toEqual(WEKKER_SLICE_SHAPE_L);
  expect(draftState.getSliceShape(2)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(3)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(4)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(5)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(6)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(7)).toEqual(WEKKER_SLICE_SHAPE);

  TI4.config.setPlayerCount(8);
  draft = new Wekker();
  draftState = draft.createEmptyDraftState("@test/wekker");
  expect(draftState).toBeDefined();
  expect(draftState.getSliceShape(0)).toEqual(WEKKER_SLICE_SHAPE_R);
  expect(draftState.getSliceShape(1)).toEqual(WEKKER_SLICE_SHAPE_L);
  expect(draftState.getSliceShape(2)).toEqual(WEKKER_SLICE_SHAPE_R);
  expect(draftState.getSliceShape(3)).toEqual(WEKKER_SLICE_SHAPE_L);
  expect(draftState.getSliceShape(4)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(5)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(6)).toEqual(WEKKER_SLICE_SHAPE);
  expect(draftState.getSliceShape(7)).toEqual(WEKKER_SLICE_SHAPE);
});
