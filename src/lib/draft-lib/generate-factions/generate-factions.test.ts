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
