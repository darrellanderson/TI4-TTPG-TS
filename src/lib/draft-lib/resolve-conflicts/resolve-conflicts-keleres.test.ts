import { DraftState } from "../draft-state/draft-state";
import { Faction } from "../../faction-lib/faction/faction";
import { ResolveConflictsKeleres } from "./resolve-conflicts-keleres";

it("static getAllKeleresFlavors", () => {
  const keleresFlavors: ReadonlyArray<Faction> =
    ResolveConflictsKeleres.getAllKeleresFlavors();
  const nsids: Array<string> = keleresFlavors.map((faction) =>
    faction.getNsid()
  );
  nsids.sort();
  expect(nsids).toEqual([
    "faction:codex.vigil/keleres-argent",
    "faction:codex.vigil/keleres-mentak",
    "faction:codex.vigil/keleres-xxcha",
  ]);
});

it("getAllLinkedFactions", () => {
  const linkedFactions: ReadonlyArray<Faction> =
    ResolveConflictsKeleres.getAllLinkedFactions();
  const nsids: Array<string> = linkedFactions.map((faction) =>
    faction.getNsid()
  );
  nsids.sort();
  expect(nsids).toEqual([
    "faction:base/mentak",
    "faction:base/xxcha",
    "faction:pok/argent",
  ]);
});

it("static getKeleresIndex", () => {
  const draftState = new DraftState("@test/test");
  draftState.setFactions([
    TI4.factionRegistry.getByNsidNameOrThrow("arborec"),
    TI4.factionRegistry.getByNsidNameOrThrow("keleres-argent"),
  ]);
  expect(ResolveConflictsKeleres.getKeleresIndex(draftState)).toBe(1);
});

it("static getKeleresIndex (missing)", () => {
  const draftState = new DraftState("@test/test");
  expect(ResolveConflictsKeleres.getKeleresIndex(draftState)).toBe(-1);
});

it("static getLinkedFactionOrThrow", () => {
  const flavorToLinkedNsid: { [key: string]: string } = {
    "faction:codex.vigil/keleres-argent": "faction:pok/argent",
    "faction:codex.vigil/keleres-mentak": "faction:base/mentak",
    "faction:codex.vigil/keleres-xxcha": "faction:base/xxcha",
  };
  for (const [flavor, linkedNsid] of Object.entries(flavorToLinkedNsid)) {
    const keleresFlavor = TI4.factionRegistry.getByNsidOrThrow(flavor);
    const linkedFaction =
      ResolveConflictsKeleres.getLinkedFactionOrThrow(keleresFlavor);
    expect(linkedFaction.getNsid()).toBe(linkedNsid);
  }
});

it("static getLinkedFactionOrThrow (throw)", () => {
  expect(() => {
    ResolveConflictsKeleres.getLinkedFactionOrThrow(
      TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec")
    );
  }).toThrow();
});

it("static getAvailableFlavors", () => {
  const draftState = new DraftState("@test/test");
  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-argent"),
    TI4.factionRegistry.getByNsidOrThrow("faction:pok/argent"),
    TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec"),
  ]);
  draftState.setFactionIndexToPlayerSlot(1, 10);

  const availableFlavors: ReadonlyArray<Faction> =
    ResolveConflictsKeleres.getAvailableFlavors(draftState);
  const nsids: Array<string> = availableFlavors.map((faction) =>
    faction.getNsid()
  );
  nsids.sort();
  expect(nsids).toEqual([
    "faction:codex.vigil/keleres-mentak",
    "faction:codex.vigil/keleres-xxcha",
  ]);
});

it("resolve (move keleres to open flavor)", () => {
  const draftState = new DraftState("@test/test");
  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-argent"),
    TI4.factionRegistry.getByNsidOrThrow("faction:pok/argent"),
    TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec"),
  ]);
  const keleresIndex: number =
    ResolveConflictsKeleres.getKeleresIndex(draftState);
  expect(keleresIndex).toBe(0);

  let updateCount: number = 0;
  draftState.onDraftStateChanged.add(() => {
    updateCount++;
  });

  // Initial state.
  expect(draftState.getFactions()[keleresIndex]?.getNsid()).toBe(
    "faction:codex.vigil/keleres-argent"
  );
  expect(updateCount).toBe(0);

  // No conflict, argent not chosen.
  new ResolveConflictsKeleres(draftState).resolve();
  expect(draftState.getFactions()[keleresIndex]?.getNsid()).toBe(
    "faction:codex.vigil/keleres-argent"
  );
  expect(updateCount).toBe(0);

  // Choose argent.
  expect(updateCount).toBe(0);
  draftState.setFactionIndexToPlayerSlot(1, 10);
  expect(updateCount).toBe(1);
  new ResolveConflictsKeleres(draftState).resolve();
  expect(draftState.getFactions()[keleresIndex]?.getNsid()).not.toBe(
    "faction:codex.vigil/keleres-argent"
  );
  expect(updateCount).toBe(2);
});
