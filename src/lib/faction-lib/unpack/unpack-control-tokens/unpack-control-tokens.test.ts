import { MockContainer, MockGameObject } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { UnpackControlTokens } from "./unpack-control-tokens";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockContainer({
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: playerSlot,
  });
  new MockGameObject({ templateMetadata: "token:base/scoreboard" });

  const unpack = new UnpackControlTokens(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("missing scoreboard", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockContainer({
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackControlTokens(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/scoreboard/);
});

it("missing control token container", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackControlTokens(faction, playerSlot);
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
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: playerSlot,
  });

  MockGameObject.simple("token.control:base/arborec", {
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackControlTokens(faction, playerSlot);
  unpack.remove();
});
