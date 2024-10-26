import { Player } from "@tabletop-playground/api";
import { MockGameObject, mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { NumpadKeyLookScoring } from "./numpad-key-look-scoring";

it("look scoring", () => {
  const numpadKey = new NumpadKeyLookScoring(19); // does not conflit

  const player: Player = new MockPlayer();
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  // Wrong key.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 18, false, false);
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  // No look-at object.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 19, false, false);
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  new MockGameObject({
    templateMetadata: "token:base/scoreboard",
    position: [100, 100, 0],
  });

  // Now there's a look-at object.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 19, false, false);
  expect(player.getPosition().toString()).toBe("(X=90,Y=100,Z=70)");

  numpadKey.destroy();
});
