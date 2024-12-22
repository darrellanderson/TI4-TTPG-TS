import { Direction, TurnOrder } from "ttpg-darrell";
import { TurnOrderMini } from "./turn-order-mini";
import { MockPlayer } from "ttpg-mock";

it("constructor/destroy", () => {
  new TurnOrderMini(1).destroy();
});

it("onTurnOrderChanged", () => {
  new TurnOrderMini(1);

  new MockPlayer({ slot: 10, name: "my-name" });
  const order: Array<number> = [10, 11, 12, 13];
  const direction: Direction = "forward";
  const current: number = 10;
  TI4.turnOrder.setTurnOrder(order, direction, current);

  TurnOrder.onTurnStateChanged.trigger(TI4.turnOrder);
});
