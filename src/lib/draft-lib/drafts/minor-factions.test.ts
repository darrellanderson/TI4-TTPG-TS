import { DraftState } from "../draft-state/draft-state";
import { IDraft } from "./idraft";
import {
  MINOR_FACTIONS_SHAPE,
  MINOR_FACTIONS_SHAPE_ALT,
  MinorFactionsDraft,
} from "./minor-factions";

it("constructor", () => {
  new MinorFactionsDraft();
});

it("isEnabled", () => {
  const minorFactions = new MinorFactionsDraft();
  expect(minorFactions.isEnabled()).toBe(true);
});

it("getDraftName", () => {
  const minorFactions = new MinorFactionsDraft();
  const draftName = minorFactions.getDraftName();
  expect(draftName).toEqual("Minor Factions Draft");
});

it("getGenerateSlicesParams", () => {
  const minorFactions = new MinorFactionsDraft();
  const generateSlicesParams = minorFactions.getGenerateSlicesParams();
  expect(generateSlicesParams).toBeDefined();
});

it("createDraftEmptyState", () => {
  let draft: IDraft | undefined;
  let draftState: DraftState | undefined;

  draft = new MinorFactionsDraft();
  draftState = draft.createEmptyDraftState("@test/minor-factions");
  expect(draftState).toBeDefined();

  expect(draftState.getSliceShape(-1)).toEqual(MINOR_FACTIONS_SHAPE);

  TI4.config.setPlayerCount(7);
  draft = new MinorFactionsDraft();
  draftState = draft.createEmptyDraftState("@test/minor-factions");
  expect(draftState.getSliceShape(-1)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(0)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(1)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(2)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(3)).toEqual(MINOR_FACTIONS_SHAPE_ALT);
  expect(draftState.getSliceShape(4)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(5)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(6)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(7)).toEqual(MINOR_FACTIONS_SHAPE);

  TI4.config.setPlayerCount(8);
  draft = new MinorFactionsDraft();
  draftState = draft.createEmptyDraftState("@test/minor-factions");
  expect(draftState).toBeDefined();
  expect(draftState.getSliceShape(0)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(1)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(2)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(3)).toEqual(MINOR_FACTIONS_SHAPE_ALT);
  expect(draftState.getSliceShape(4)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(5)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(6)).toEqual(MINOR_FACTIONS_SHAPE);
  expect(draftState.getSliceShape(7)).toEqual(MINOR_FACTIONS_SHAPE_ALT);
});
