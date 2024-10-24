import { MockGameObject } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackLeaders } from "./unpack-leaders";
import { GameObject } from "@tabletop-playground/api";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackLeaders(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("_findLeaderSheetOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const leaderSheet: GameObject = new MockGameObject({
    templateMetadata: "sheet:pok/leader",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackLeaders(faction, playerSlot);
  const found: GameObject = unpack._findLeaderSheetOrThrow();
  expect(found).toEqual(leaderSheet);
});

it("_findLeaderSheetOrThrow (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackLeaders(faction, playerSlot);
  expect(() => unpack._findLeaderSheetOrThrow()).toThrow();
});
