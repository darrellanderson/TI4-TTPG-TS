import { Faction } from "../../faction-lib/faction/faction";
import { GenerateFactions } from "./generate-factions";

it("generate", () => {
  const count = 6;
  const factions = new GenerateFactions().generate(count);
  expect(factions.length).toBe(count);
});

it("_resolve", () => {
  const factions: Array<Faction> = ["faction:base/arborec"].map((nsid) =>
    TI4.factionRegistry.getByNsidOrThrow(nsid)
  );

  const count = 1;
  const out: Array<string> = new GenerateFactions()
    ._resolve(count, factions)
    .map((faction) => faction.getAbbr());
  expect(out).toEqual(["Arborec"]);
});

it("_resolve (Keleres singleton)", () => {
  const factions: Array<Faction> = [
    "faction:codex.vigil/keleres-argent",
    "faction:codex.vigil/keleres-mentak",
    "faction:codex.vigil/keleres-xxcha",
    "faction:base/naalu",
  ].map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid));

  const count = 2;
  const out: Array<string> = new GenerateFactions()
    ._resolve(count, factions)
    .map((faction) => faction.getAbbr());
  expect(out).toEqual(["Keleres (Argent)", "Naalu"]);
});

it("_resolve (Keleres block argent)", () => {
  const factions: Array<Faction> = [
    "faction:codex.vigil/keleres-argent",
    "faction:base/mentak",
    "faction:base/xxcha",
    "faction:pok/argent",
    "faction:base/naalu",
  ].map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid));

  const count = 4;
  const out: Array<string> = new GenerateFactions()
    ._resolve(count, factions)
    .map((faction) => faction.getAbbr());
  expect(out).toEqual(["Keleres (Argent)", "Mentak", "Xxcha", "Naalu"]);
});

it("_resolve (Keleres block mentak)", () => {
  const factions: Array<Faction> = [
    "faction:codex.vigil/keleres-mentak",
    "faction:pok/argent",
    "faction:base/xxcha",
    "faction:base/mentak",
    "faction:base/naalu",
  ].map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid));

  const count = 4;
  const out: Array<string> = new GenerateFactions()
    ._resolve(count, factions)
    .map((faction) => faction.getAbbr());
  expect(out).toEqual(["Keleres (Mentak)", "Argent", "Xxcha", "Naalu"]);
});

it("_resolve (Keleres block xxcha)", () => {
  const factions: Array<Faction> = [
    "faction:codex.vigil/keleres-xxcha",
    "faction:pok/argent",
    "faction:base/mentak",
    "faction:base/xxcha",
    "faction:base/naalu",
  ].map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid));

  const count = 4;
  const out: Array<string> = new GenerateFactions()
    ._resolve(count, factions)
    .map((faction) => faction.getAbbr());
  expect(out).toEqual(["Keleres (Xxcha)", "Argent", "Mentak", "Naalu"]);
});

it("_resolve (block keleres)", () => {
  const factions: Array<Faction> = [
    "faction:pok/argent",
    "faction:base/mentak",
    "faction:base/xxcha",
    "faction:codex.vigil/keleres-xxcha",
    "faction:base/naalu",
  ].map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid));

  const count = 4;
  const out: Array<string> = new GenerateFactions()
    ._resolve(count, factions)
    .map((faction) => faction.getAbbr());
  expect(out).toEqual(["Argent", "Mentak", "Xxcha", "Naalu"]);
});

it("_resolve (not enough factions)", () => {
  const factions: Array<Faction> = ["faction:base/naalu"].map((nsid) =>
    TI4.factionRegistry.getByNsidOrThrow(nsid)
  );

  const generateFactions = new GenerateFactions();
  const count = 2;
  expect(() => generateFactions._resolveOrThrow(count, factions)).toThrow();
});

/*
it("distribution (not a normal test)", () => {
  // This is not a normal test. It's just to get some idea of the distribution.
  const iterations = 100000;
  const count = 6;
  const tally: { [key: string]: number } = {};
  for (let i = 0; i < iterations; i++) {
    const factions: Array<Faction> = new GenerateFactions().generate(count);
    factions.forEach((faction) => {
      const key: string = faction.getAbbr().split(" ")[0] ?? "-";
      if (!(key in tally)) {
        tally[key] = 0;
      }
      tally[key]++;
    });
  }
  const entries = Object.entries(tally);
  entries.sort((a, b) => b[1] - a[1]);
  const lines: Array<string> = [];
  for (const [key, value] of entries) {
    const percentage = ((value / iterations) * 100).toFixed(2);
    lines.push(`${percentage}% ${key}`);
  }
  console.log(lines.join("\n"));
});
*/
