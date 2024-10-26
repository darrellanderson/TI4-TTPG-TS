import { Player } from "@tabletop-playground/api";
import { NumpadKeyLookMap } from "./numpad-key-look-map";
import { mockGlobalEvents, MockPlayer } from "ttpg-mock";

it("look map", () => {
  const numpadKey = new NumpadKeyLookMap(19); // do not conflict with global keys

  const player: Player = new MockPlayer();
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  // Wrong key.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 18, false, false);

  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 19, false, false);
  expect(player.getPosition().toString()).toBe("(X=-10,Y=0,Z=110)");

  numpadKey.destroy();
});
