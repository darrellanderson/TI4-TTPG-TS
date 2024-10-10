import { GameObject, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";

import { BuildArea } from "./build-area";
import { System } from "../lib/system-lib/system/system";

it("constructor", () => {
  const obj = new MockGameObject();
  obj.setOwningPlayerSlot(10);
  const buildArea = new BuildArea(obj);
  expect(buildArea).toBeDefined();
});

it("constructor (no owner)", () => {
  const obj = new MockGameObject();
  expect(() => new BuildArea(obj)).toThrow(
    "BuildArea must have an owning player slot."
  );
});

it("onReleased handling", () => {
  const obj = new MockGameObject();
  obj.setOwningPlayerSlot(10);
  new BuildArea(obj);
  const player = new MockPlayer();
  obj._releaseAsPlayer(player, false);
});

it("_getSystemTileHome", () => {
  const mat = new MockGameObject({ owningPlayerSlot: 10 });
  const buildArea = new BuildArea(mat);
  let found: GameObject | undefined = buildArea._getSystemTileHome();
  expect(found).toBeUndefined();

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const find = new Find();
  const closest: number = find.closestOwnedCardHolderOwner(new Vector(0, 0, 0));
  expect(closest).toBe(10);

  new MockGameObject({
    templateMetadata: "sheet.faction:base/sol",
  });
  expect(TI4.factionRegistry.getByPlayerSlot(10)).toBeDefined();

  new MockGameObject({
    id: "my-home",
    templateMetadata: "tile.system:base/1",
    owningPlayerSlot: 10,
  });

  found = buildArea._getSystemTileHome();
  expect(found?.getId()).toBe("my-home");
});

it("_getSystemTileLastActivated", () => {
  const mat = new MockGameObject({ owningPlayerSlot: 10 });
  const buildArea = new BuildArea(mat);
  let found: GameObject | undefined = buildArea._getSystemTileLastActivated();
  expect(found).toBeUndefined();

  new MockGameObject({
    id: "my-last-activated",
    templateMetadata: "tile.system:base/18",
    owningPlayerSlot: 10,
  });
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileObjId("my-last-activated");
  if (!system) {
    throw new Error("System not found");
  }
  const player = new MockPlayer({ slot: 10 });
  TI4.onSystemActivated.trigger(system, player);

  found = buildArea._getSystemTileLastActivated();
  expect(found?.getId()).toBe("my-last-activated");
});

it("update", () => {
  const mat = new MockGameObject({ owningPlayerSlot: 10 });
  const buildArea = new BuildArea(mat);
  buildArea.update();
});
