import { TurnOrderUI } from "./turn-order-ui";

it("attach", () => {
  new TurnOrderUI().setPlayerCount(6).attachToScreen();
  TI4.turnOrder.setTurnOrder([1, 2, 3], "forward", 1);
});
