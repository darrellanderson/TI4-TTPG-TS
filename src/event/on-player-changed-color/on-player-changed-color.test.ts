import { Player } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";
import { OnPlayerChangedColor } from "./on-player-changed-color";

it("init", () => {
  const onPlayerChangedColor = new OnPlayerChangedColor();
  onPlayerChangedColor.init();
});

it("send event", () => {
  const playerSlot: number = 10;
  const colorName: string = "red";
  const colorHex: string = "#FF0000";
  const clickingPlayer: Player = new MockPlayer();
  TI4.events.onPlayerChangedColor.trigger(
    playerSlot,
    colorName,
    colorHex,
    clickingPlayer
  );
});
