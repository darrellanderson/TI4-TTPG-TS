import { NamespaceId } from "ttpg-darrell";
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

it("constructor, isDraftInProgress, destroy", () => {
  const namespaceId: NamespaceId = "@test/draft-state";
  expect(DraftState.isDraftInProgress(namespaceId)).toBe(false);

  const draftState = new DraftState(namespaceId);
  expect(draftState.isActive()).toBeTruthy();
  expect(DraftState.isDraftInProgress(namespaceId)).toBeTruthy();

  // Create from the existing draft state.
  new DraftState(namespaceId);

  draftState.destroy();
  expect(draftState.isActive()).toBeFalsy();
  expect(DraftState.isDraftInProgress(namespaceId)).toBeFalsy();
});

it("base map", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getBaseMap()).toEqual("");
  state.setBaseMap("test");
  expect(state.getBaseMap()).toEqual("test");
});

it("slice shape", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getSliceShape(0)).toEqual([]);

  state.setSliceShape(["<0,0,0>", "<1,0,-1>", "<2,0,-1>"]);
  expect(state.getSliceShape(0)).toEqual(["<0,0,0>", "<1,0,-1>", "<2,0,-1>"]);

  state.overrideSliceShape(0, ["<3,0,-3>", "<4,0,-4>", "<5,0,-5>"]);
  expect(state.getSliceShape(0)).toEqual(["<3,0,-3>", "<4,0,-4>", "<5,0,-5>"]);

  // Slice shape must be the same length.
  expect(() => {
    state.overrideSliceShape(1, ["<3,0,-3>"]);
  }).toThrow();
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

it("slice labels", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getSliceLabels()).toEqual([]);
  state.setSliceLabels(["A", "B", "C"]);
  expect(state.getSliceLabels()).toEqual(["A", "B", "C"]);

  expect(() => {
    state.setSliceLabels([new Array(101).fill("A").join("")]);
  }).toThrow();
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

it("opaques", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getOpaques()).toEqual([]);
  state.setOpaques(["opaque1", "opaque2"]);
  expect(state.getOpaques()).toEqual(["opaque1", "opaque2"]);
});

it("speaker index", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getSpeakerIndex()).toBe(-1);
  state.setSpeakerIndex(2);
  expect(state.getSpeakerIndex()).toBe(2);
});

it("sliceIndexToPlayerSlot", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getSliceIndexToPlayerSlot(0)).toBe(-1);
  state.setSliceIndexToPlayerSlot(0, 1);
  expect(state.getSliceIndexToPlayerSlot(0)).toBe(1);
  state.setSliceIndexToPlayerSlot(0, -1);
  expect(state.getSliceIndexToPlayerSlot(0)).toBe(-1);
});

it("factionIndexToPlayerSlot", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getFactionIndexToPlayerSlot(0)).toBe(-1);
  state.setFactionIndexToPlayerSlot(0, 1);
  expect(state.getFactionIndexToPlayerSlot(0)).toBe(1);
  state.setFactionIndexToPlayerSlot(0, -1);
  expect(state.getFactionIndexToPlayerSlot(0)).toBe(-1);
});

it("seatIndexToFaction", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  state.setFactions(
    ["faction:base/arborec", "faction:base/sol", "faction:pok/ul"].map(
      (nsidName) => TI4.factionRegistry.getByNsidOrThrow(nsidName)
    )
  );

  const playerSlot: number = 13;
  const seatIndex: number = 1;
  const factionIndex: number = 0;

  expect(state.getSeatIndexToFaction(seatIndex)).toBeUndefined();

  state.setSeatIndexToPlayerSlot(seatIndex, playerSlot);
  expect(state.getSeatIndexToFaction(seatIndex)).toBeUndefined();

  state.setFactionIndexToPlayerSlot(factionIndex, playerSlot);
  expect(state.getSeatIndexToFaction(seatIndex)?.getAbbr()).toBe("Arborec");
});

it("seatIndexToPlayerSlot", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getSeatIndexToPlayerSlot(0)).toBe(-1);
  state.setSeatIndexToPlayerSlot(0, 1);
  expect(state.getSeatIndexToPlayerSlot(0)).toBe(1);
  state.setSeatIndexToPlayerSlot(0, -1);
  expect(state.getSeatIndexToPlayerSlot(0)).toBe(-1);
});

it("opaqueIndexToPlayerSlot", () => {
  const state: DraftState = new DraftState("@test/draft-state");
  expect(state.getOpaqueIndexToPlayerSlot(0)).toBe(-1);
  state.setOpaqueToPlayerSlot(0, 1);
  expect(state.getOpaqueIndexToPlayerSlot(0)).toBe(1);
  state.setOpaqueToPlayerSlot(0, -1);
  expect(state.getOpaqueIndexToPlayerSlot(0)).toBe(-1);
});

it("load from state where a lower index is missing", () => {
  let state: DraftState;

  // Set a non-zero index value, to make sure the zod parsing is working.
  state = new DraftState("@test/draft-state");
  state.setSliceIndexToPlayerSlot(3, 1);
  expect(state.getSliceIndexToPlayerSlot(3)).toBe(1);

  state = new DraftState("@test/draft-state");
  expect(state.getSliceIndexToPlayerSlot(3)).toBe(1);
});

it("isComplete", () => {
  const state: DraftState = new DraftState("@test/draft-state")
    .setSliceShape(["<0,0,0>", "<1,0,-1>", "<2,0,-1>"])
    .setSlices([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
    .setFactions(
      ["faction:base/arborec", "faction:base/sol", "faction:pok/ul"].map(
        (nsidName) => TI4.factionRegistry.getByNsidOrThrow(nsidName)
      )
    );

  TI4.config.setPlayerCount(1);
  expect(state.isComplete()).toBe(false);

  state.setSpeakerIndex(2);
  expect(state.isComplete()).toBe(false);

  state.setSliceIndexToPlayerSlot(0, 1);
  expect(state.isComplete()).toBe(false);

  state.setFactionIndexToPlayerSlot(0, 2);
  expect(state.isComplete()).toBe(false);

  state.setSeatIndexToPlayerSlot(0, 3);
  expect(state.isComplete()).toBe(true);
});
