import { GameObject } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

import { SpawnControlToken } from "./spawn-control-token";

import { addObjectTemplatesToMockWorld } from "../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new SpawnControlToken();
});

it("spawnControlToken", () => {
  const spawnControlToken: SpawnControlToken = new SpawnControlToken();
  let controlToken: GameObject | undefined;

  expect(TI4.factionRegistry.getByPlayerSlot(3)).toBeUndefined();
  controlToken = spawnControlToken.spawnControlToken(3);
  expect(controlToken).toBeUndefined();

  // Set up faction.
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 3,
  });
  new MockCardHolder({ owningPlayerSlot: 3 });
  expect(TI4.factionRegistry.getByPlayerSlot(3)).toBeDefined();

  controlToken = spawnControlToken.spawnControlToken(3);
  expect(controlToken).toBeDefined();
});

it("spawnControlTokenOrThrow", () => {
  const spawnControlToken: SpawnControlToken = new SpawnControlToken();

  expect(() => {
    spawnControlToken.spawnControlTokenOrThrow(3);
  }).toThrow();

  // Set up faction.
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 3,
  });
  new MockCardHolder({ owningPlayerSlot: 3 });
  expect(TI4.factionRegistry.getByPlayerSlot(3)).toBeDefined();

  spawnControlToken.spawnControlTokenOrThrow(3);
});
