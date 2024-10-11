import { GameObject, Player } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";

import { ActivateSystem } from "./activate-system";
import { System } from "../../lib/system-lib/system/system";

it("constructor", () => {
  new ActivateSystem();
});

it("activate", () => {
  let activatedTileNumber: number = -1;
  TI4.onSystemActivated.add((system: System, _player: Player) => {
    activatedTileNumber = system.getSystemTileNumber();
  });

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

  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
    position: [10, 0, 0],
  });
  const player: Player = new MockPlayer({ slot: 3 });

  expect(tacticToken.getPosition().toString()).toBe("(X=1,Y=0,Z=0)");
  expect(activatedTileNumber).toBe(-1);

  const activateSystem = new ActivateSystem();
  activateSystem.moveCommandTokenToSystem(systemTileObj, player);

  expect(tacticToken.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
  expect(activatedTileNumber).toBe(18);
});
