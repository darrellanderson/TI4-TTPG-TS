import { MockContainer } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackFactionExtras } from "./unpack-faction-extras";
import { Container } from "@tabletop-playground/api";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackFactionExtras(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("_getFactionExtrasContainerOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  const factionExtrasContainer: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackFactionExtras(faction, playerSlot);
  const found: Container = unpack._getFactionExtrasContainerOrThrow();
  expect(found).toBe(factionExtrasContainer);
});

it("_getFactionExtrasContainerOrThrow (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionExtras(faction, playerSlot);
  expect(() => {
    unpack._getFactionExtrasContainerOrThrow();
  }).toThrow(/Faction extras container not found/);
});
