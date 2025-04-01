import { Button, Color, ContentButton, Player } from "@tabletop-playground/api";
import { MockCardHolder, MockPlayer } from "ttpg-mock";

import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { DraftStateUI } from "./draft-state-ui";
import { MILTY_SLICE_SHAPE } from "../../../lib/draft-lib/drafts/milty";
import {
  SliceShape,
  SliceTiles,
} from "../../../lib/draft-lib/generate-slices/generate-slices";
import { CreateZoomedUiType } from "../../zoomable-ui/zoomable-ui";

beforeEach(() => {
  // Player seats looks for card holders.
  for (let slot = 10; slot < 16; slot++) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: slot,
      position: [-10 * slot, 10, 0],
    });
  }
});

it("constructor", () => {
  const draftState: DraftState = new DraftState("@test/draft-state");
  draftState.setSliceShape(MILTY_SLICE_SHAPE);
  draftState.setSlices([[21, 22, 23, 24, 25]]);
  draftState.setSliceLabels(["A"]);
  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec"),
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-argent"),
  ]);
  draftState.setSpeakerIndex(0);

  const scale: number = 1;
  const draftStateUi = new DraftStateUI(draftState, scale);

  draftState.onDraftStateChanged.trigger(draftState);
  draftStateUi.destroy();
});

it("_maybeAdvanceTurn", () => {
  TI4.turnOrder.setTurnOrder([10, 11, 12, 13, 14, 15], "forward", 10);
  const player: Player = new MockPlayer({ slot: 10 });
  DraftStateUI._maybeAdvanceTurn(player);
  expect(TI4.turnOrder.getCurrentTurn()).toBe(11);
});

it("_getSliceColorOrThrow", () => {
  DraftStateUI._getSliceColorOrThrow(0);
  expect(() => {
    DraftStateUI._getSliceColorOrThrow(100);
  }).toThrow();
});

it("_createSliceClickHandler", () => {
  const draftState: DraftState = new DraftState("@test/draft-state").setSlices([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
  ]);

  const sliceIndex: number = 0;
  const handler: (button: ContentButton, player: Player) => void =
    DraftStateUI._createSliceClickHandler(draftState, sliceIndex);
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex)).toBe(-1);

  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex)).toBe(10);

  // Click again to clear.
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 1000); // dodge throttling
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex)).toBe(-1);

  // Select a different item, click to swap.
  draftState.setSliceIndexToPlayerSlot(sliceIndex + 1, 10);
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex + 1)).toBe(10);
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex)).toBe(-1);
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 2000); // dodge throttling
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex + 1)).toBe(-1);
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex)).toBe(10);
});

it("_createFactionClickHandler", () => {
  const draftState: DraftState = new DraftState(
    "@test/draft-state"
  ).setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec"),
    TI4.factionRegistry.getByNsidOrThrow("faction:base/sol"),
  ]);

  const sliceIndex: number = 0;
  const handler: (button: ContentButton, player: Player) => void =
    DraftStateUI._createFactionClickHandler(draftState, sliceIndex);
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex)).toBe(-1);

  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex)).toBe(10);

  // Click again to clear.
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 1000); // dodge throttling
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex)).toBe(-1);

  // Select a different item, click to swap.
  draftState.setFactionIndexToPlayerSlot(sliceIndex + 1, 10);
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex + 1)).toBe(10);
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex)).toBe(-1);
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 2000); // dodge throttling
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex + 1)).toBe(-1);
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex)).toBe(10);
});

it("_createSeatClickHandler", () => {
  const draftState: DraftState = new DraftState("@test/draft-state");

  const sliceIndex: number = 0;
  const handler: (button: ContentButton, player: Player) => void =
    DraftStateUI._createSeatClickHandler(draftState, sliceIndex);
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(-1);

  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(10);

  // Click again to clear.
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 1000); // dodge throttling
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(-1);

  // Select a different item, click to swap.
  draftState.setSeatIndexToPlayerSlot(sliceIndex + 1, 10);
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex + 1)).toBe(10);
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(-1);
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 2000); // dodge throttling
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex + 1)).toBe(-1);
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(10);
});

it("_createFinishClickHandler", () => {
  const draftState: DraftState = new DraftState("@test/draft-state");
  const handler: (button: Button, player: Player) => void =
    DraftStateUI._createFinishClickHandler(draftState);

  expect(draftState.isActive()).toBe(true);
  expect(() => {
    handler(new Button(), new MockPlayer({ slot: 10 }));
  }).toThrow(); // let DraftStateActivityFinish handle the deeper testing
});

it("_createCancelClickHandler", () => {
  const draftState: DraftState = new DraftState("@test/draft-state");
  const handler: (button: Button, player: Player) => void =
    DraftStateUI._createCancelClickHandler(draftState);

  expect(draftState.isActive()).toBe(true);
  handler(new Button(), new MockPlayer({ slot: 10 }));
  expect(draftState.isActive()).toBe(false);
});

it("_getCreateZoomedSliceUi", () => {
  const slice: SliceTiles = [1, 2, 3, 4, 5];
  const sliceShape: SliceShape = MILTY_SLICE_SHAPE;
  const color: Color = new Color(0, 0, 0, 1);
  const createZoomedSliceUi: CreateZoomedUiType =
    DraftStateUI._getCreateZoomedSliceUi(slice, sliceShape, color);

  const scale: number = 1;
  createZoomedSliceUi(scale);
});

it("_getCreateZoomedMapUi", () => {
  const draftState: DraftState = new DraftState("@test/draft-state");

  const createZoomedMapUi = DraftStateUI._getCreatedZoomedMapUi(draftState);
  const scale = 1;
  createZoomedMapUi(scale);
});
