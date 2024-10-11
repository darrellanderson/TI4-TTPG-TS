import { GameObject, Player } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";

import { ActivateSystem } from "./activate-system";
import { System } from "../../lib/system-lib/system/system";

it("constructor", () => {
  new MockGameObject(); // so an object is in the world
  new ActivateSystem().init();
});

it("activate", () => {
  let activatedTileNumber: number = -1;
  TI4.onSystemActivated.add((system: System, _player: Player) => {
    activatedTileNumber = system.getSystemTileNumber();
  });

  let systemTileObj: MockGameObject;
  let success: boolean;

  systemTileObj = new MockGameObject();
  const player: Player = new MockPlayer({ slot: 3 });

  const activateSystem = new ActivateSystem();
  activateSystem.init();
  success = activateSystem.moveCommandTokenToSystem(systemTileObj, player);
  expect(success).toBe(false); // not a system tile

  systemTileObj = new MockGameObject({
    templateMetadata: "tile.system:base/18",
  });
  success = activateSystem.moveCommandTokenToSystem(systemTileObj, player);
  expect(success).toBe(false); // no command token

  // Objects link to closest card holder.
  new MockCardHolder({ owningPlayerSlot: 3 });

  new MockGameObject({
    templateMetadata: "sheet:base/command",
    position: [0, -0.96, 0],
  });

  const tacticToken: GameObject = new MockGameObject({
    id: "tactic",
    templateMetadata: "token.command:base/sol",
    position: [1, 0, 0],
  });

  systemTileObj = new MockGameObject({
    templateMetadata: "tile.system:base/18",
    position: [10, 0, 0],
  });

  expect(tacticToken.getPosition().toString()).toBe("(X=1,Y=0,Z=0)");
  expect(activatedTileNumber).toBe(-1);

  success = activateSystem.moveCommandTokenToSystem(systemTileObj, player);
  expect(success).toBe(true);

  expect(tacticToken.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
  expect(activatedTileNumber).toBe(18);
});

it("activate with custom action", () => {
  const systemTileObj: MockGameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
  });
  new ActivateSystem().init();
  const player: Player = new MockPlayer();

  systemTileObj._customActionAsPlayer(player, "*Activate System");
});
