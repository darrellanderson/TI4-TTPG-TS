import {
  DraftState,
  DraftStateSchema,
  DraftStateSchemaType,
} from "./draft-state";

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

it("slice shape", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getSliceShape()).toEqual([]);
  state.setSliceShape(["<0,0,0>", "<1,0,-1>", "<2,0,-1>"]);
  expect(state.getSliceShape()).toEqual(["<0,0,0>", "<1,0,-1>", "<2,0,-1>"]);
});

it("slices", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getSlices()).toEqual([]);
  state.setSlices([
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
  expect(state.getSlices()).toEqual([
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
});

it("factions", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getFactions()).toEqual([]);
  state.setFactions(
    ["faction:base/arborec", "faction:base/sol", "faction:pok/ul"].map(
      (nsidName) => TI4.factionRegistry.getByNsidOrThrow(nsidName)
    )
  );
  expect(state.getFactions().map((faction) => faction.getNsid())).toEqual([
    "faction:base/arborec",
    "faction:base/sol",
    "faction:pok/ul",
  ]);
});
