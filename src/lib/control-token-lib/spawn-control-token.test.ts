import { Color, GameObject } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

import { SpawnControlToken } from "./spawn-control-token";

it("constructor", () => {
  new SpawnControlToken();
});

it("color available", () => {
  const color: Color | undefined = TI4.playerColor.getSlotPlasticColor(10);
  expect(color).toBeDefined();
});

it("spawnControlToken", () => {
  const spawnControlToken: SpawnControlToken = new SpawnControlToken();
  let controlToken: GameObject | undefined;

  expect(TI4.factionRegistry.getByPlayerSlot(10)).toBeUndefined();
  controlToken = spawnControlToken.spawnControlToken(10);
  expect(controlToken).toBeUndefined();

  // Set up faction.
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({ owningPlayerSlot: 10 });
  expect(TI4.factionRegistry.getByPlayerSlot(10)).toBeDefined();

  controlToken = spawnControlToken.spawnControlToken(10);
  expect(controlToken).toBeDefined();
  expect(controlToken?.getOwningPlayerSlot()).toBe(10);
});

it("spawnControlTokenOrThrow", () => {
  const spawnControlToken: SpawnControlToken = new SpawnControlToken();

  expect(() => {
    spawnControlToken.spawnControlTokenOrThrow(10);
  }).toThrow();

  // Set up faction.
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({ owningPlayerSlot: 10 });
  expect(TI4.factionRegistry.getByPlayerSlot(10)).toBeDefined();

  spawnControlToken.spawnControlTokenOrThrow(10);
});
