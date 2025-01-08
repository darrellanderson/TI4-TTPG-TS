import { Player } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";
import { OnPlayerChangeColorRequest } from "./on-player-change-color-request";

it("init/destroy", () => {
  const onPlayerChangeColorRequest = new OnPlayerChangeColorRequest();
  onPlayerChangeColorRequest.init();
  onPlayerChangeColorRequest.destroy();
});

it("event", () => {
  new OnPlayerChangeColorRequest().init();
  const playerSlot: number = 10;
  const clickingPlayer: Player = new MockPlayer();
  TI4.events.onPlayerChangeColorRequest.trigger(playerSlot, clickingPlayer);
});
