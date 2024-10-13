import { TurnOrderUI } from "./turn-order-ui";

it("attach", () => {
  const turnOrderUI = new TurnOrderUI()
    .setPlayerCount(6)
    .attachToScreen()
    .attachToScreen(); // again, will re-attach
  TI4.turnOrder.setTurnOrder([1, 2, 3], "forward", 1);
  turnOrderUI.destroy();
});
