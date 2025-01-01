import { GameObject, Player } from "@tabletop-playground/api";
import { MockGameObject, mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { NumpadKeyLookActiveSystem } from "./numpad-key-look-active-system";
import { System } from "../../system-lib/system/system";

it("look active system", () => {
  const numpadKey = new NumpadKeyLookActiveSystem(19); // does not conflit

  const player: Player = new MockPlayer();
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  // Wrong key.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 18, false, false);
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  // No active system.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 19, false, false);
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/19",
    position: [100, 100, 0],
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  if (system) {
    TI4.events.onSystemActivated.trigger(system, player);
  }

  // Now there's an active system.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 19, false, false);
  expect(player.getPosition().toString()).toBe("(X=90,Y=100,Z=20)");

  numpadKey.destroy();
});
