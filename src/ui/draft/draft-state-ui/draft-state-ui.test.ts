import { ContentButton, Player } from "@tabletop-playground/api";
import { MockCardHolder, MockPlayer } from "ttpg-mock";

import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { DraftStateUI } from "./draft-state-ui";
import { MILTY_SLICE_SHAPE } from "../../../lib/draft-lib/drafts/milty";

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
  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec"),
  ]);
  draftState.setSpeakerIndex(0);

  const scale: number = 1;
  new DraftStateUI(draftState, scale);

  draftState.onDraftStateChanged.trigger(draftState);
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
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex)).toBe(-1);

  // Select a different item, click to swap.
  draftState.setSliceIndexToPlayerSlot(sliceIndex + 1, 10);
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex + 1)).toBe(10);
  expect(draftState.getSliceIndexToPlayerSlot(sliceIndex)).toBe(-1);
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
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex)).toBe(-1);

  // Select a different item, click to swap.
  draftState.setFactionIndexToPlayerSlot(sliceIndex + 1, 10);
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex + 1)).toBe(10);
  expect(draftState.getFactionIndexToPlayerSlot(sliceIndex)).toBe(-1);
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
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(-1);

  // Select a different item, click to swap.
  draftState.setSeatIndexToPlayerSlot(sliceIndex + 1, 10);
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex + 1)).toBe(10);
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(-1);
  handler(new ContentButton(), new MockPlayer({ slot: 10 }));
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex + 1)).toBe(-1);
  expect(draftState.getSeatIndexToPlayerSlot(sliceIndex)).toBe(10);
});
