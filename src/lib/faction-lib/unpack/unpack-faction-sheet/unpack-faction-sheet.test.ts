import { MockGameObject } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackFactionSheet } from "./unpack-faction-sheet";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet.faction:base/generic",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackFactionSheet(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("missing generic faction sheet", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionSheet(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/generic faction sheet/);
});

it("missing faction sheet", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionSheet(faction, playerSlot);
  expect(() => {
    unpack.remove();
  }).toThrow(/faction sheet/);
});
