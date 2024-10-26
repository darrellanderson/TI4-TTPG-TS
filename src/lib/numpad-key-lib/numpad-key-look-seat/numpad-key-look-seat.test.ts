import { Player } from "@tabletop-playground/api";
import { MockCardHolder, mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { NumpadKeyLookSeat } from "./numpad-key-look-seat";

it("create/destroy", () => {
  new NumpadKeyLookSeat().destroy();
});

it("look seat", () => {
  // registered as part of global, no need to create our own.
  const player: Player = new MockPlayer();

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [100, 100, 0],
  });

  expect(player.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 1, true, false);

  // Look with a slight angle, hence the X difference.
  expect(player.getPosition().toString()).toEqual("(X=60,Y=100,Z=70)");

  // Again, but no such seat.
  mockGlobalEvents._scriptButtonPressedAsPlayer(player, 2, true, false);
  expect(player.getPosition().toString()).toEqual("(X=60,Y=100,Z=70)"); // no change
});
