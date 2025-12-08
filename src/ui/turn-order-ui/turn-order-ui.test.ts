import { Player } from "@tabletop-playground/api";
import { TurnOrderUI } from "./turn-order-ui";
import { MockPlayer } from "ttpg-mock";

it("attach", () => {
  const turnOrderUI = new TurnOrderUI()
    .setPlayerCount(6)
    .attachToScreen()
    .attachToScreen(); // again, will re-attach
  TI4.turnOrder.setTurnOrder([1, 2, 3], "forward", 1);
  turnOrderUI.destroy();
});

it("getParams, onCustomAction", () => {
  const turnOrderUI = new TurnOrderUI();
  turnOrderUI.attachToScreen();

  const params = turnOrderUI.getParams();
  const clickingPlayer: Player = new MockPlayer();
  const identifier: string = "Change color";
  const targetPlayerSlot: number = 1;

  const onCustomAction:
    | ((
        clickingPlayer: Player,
        identifier: string,
        targetPlayerSlot: number
      ) => void)
    | undefined = params.onCustomAction;
  if (!onCustomAction) {
    throw new Error("onCustomAction is undefined");
  }
  onCustomAction(clickingPlayer, identifier, targetPlayerSlot);

  turnOrderUI.destroy();
});

it("onPlayerChangedColor", () => {
  const turnOrderUI = new TurnOrderUI();
  turnOrderUI.attachToScreen();

  const playerSlot: number = 10;
  const colorName: string = "red";
  const colorHex: string = "#ff0000";
  const clickingPlayer: Player = new MockPlayer();
  TI4.events.onPlayerChangedColor.trigger(
    playerSlot,
    colorName,
    colorHex,
    clickingPlayer
  );

  turnOrderUI.destroy();
});
