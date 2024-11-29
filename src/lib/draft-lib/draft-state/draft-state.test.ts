import { DraftStateSchema, DraftStateSchemaType } from "./draft-state";

it("schema (empty)", () => {
  const state: DraftStateSchemaType = DraftStateSchema.parse({});
  expect(state).toBeDefined();
});

it("schema (full)", () => {
  const state: DraftStateSchemaType = DraftStateSchema.parse({
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-1>"],
    slices: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    factions: ["arborec", "sol", "ul"],
    speakerIndex: 0,
    sliceIndexToPlayerSlot: [1, 2, 3],
    factionIndexToPlayerSlot: [4, 5, 6],
    seatIndexToPlayerSlot: [7, 8, 9],
  });
  const json: string = JSON.stringify(state, null, 2);
  const parsed = JSON.parse(json);
  const asType: DraftStateSchemaType = DraftStateSchema.parse(parsed);
  expect(asType).toEqual(state);
});
