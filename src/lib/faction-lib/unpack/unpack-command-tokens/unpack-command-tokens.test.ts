import { MockContainer, MockGameObject } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackCommandTokens } from "./unpack-command-tokens";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet:base/command",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackCommandTokens(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("missing command sheet", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackCommandTokens(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/command sheet/);
});

it("missing command token container", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackCommandTokens(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/container/);
});

it("remove (find token)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: playerSlot,
  });

  MockGameObject.simple("token.command:base/arborec", {
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackCommandTokens(faction, playerSlot);
  unpack.remove();
});
