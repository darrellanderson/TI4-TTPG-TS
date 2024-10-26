import { MockCardHolder, mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { NumpadKeyLookMySeat } from "./numpad-key-look-my-seat";
import { Player } from "@tabletop-playground/api";

it("look my seat", () => {
  const numpadKey = new NumpadKeyLookMySeat(19); // do not conflict with global keys

  const player: Player = new MockPlayer({ slot: 10 });
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  // Wrong key.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 18, false, false);

  // Keypress, but no card holder.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 19, false, false);
  expect(player.getPosition().toString()).toBe("(X=0,Y=0,Z=0)");

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: player.getSlot(),
    position: [100, 100, 0],
  });

  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 19, false, false);
  expect(player.getPosition().toString()).toBe("(X=60,Y=100,Z=70)");

  numpadKey.destroy();
});
